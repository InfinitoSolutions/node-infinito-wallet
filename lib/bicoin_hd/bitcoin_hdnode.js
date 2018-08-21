const Buffer = require('safe-buffer').Buffer;
const createHmac = require('create-hmac');
const typeforce = require('typeforce');
const types = require('./types');
const BigInteger = require('bigi');
const ECPair = require('./ecpair');

class HDNode {
  constructor(keyPair, chainCode) {
    typeforce(types.tuple('ECPair', types.Buffer256bit), arguments);

    if (!keyPair.compressed) throw new TypeError('BIP32 only allows compressed keyPairs');

    this.keyPair = keyPair;
    this.chainCode = chainCode;
    this.depth = 0;
    this.index = 0;
    this.parentFingerprint = 0x00000000;
  }

  static fromSeedBuffer(seed, network) {
    typeforce(types.tuple(types.Buffer, types.maybe(types.Network)), arguments);

    if (seed.length < 16) throw new TypeError('Seed should be at least 128 bits');
    if (seed.length > 64) throw new TypeError('Seed should be at most 512 bits');
    console.log(seed, network, );
    let MASTER_SECRET = new Buffer('Bitcoin seed');
    var I = createHmac('sha512', MASTER_SECRET).update(seed).digest();
    var IL = I.slice(0, 32);
    var IR = I.slice(32);

    // In case IL is 0 or >= n, the master key is invalid
    // This is handled by the ECPair constructor
    var pIL = BigInteger.fromBuffer(IL);
    var keyPair = new ECPair(pIL, null, {
      network: network
    });

    return new HDNode(keyPair, IR);
  }

  static fromSeedHex(hex, network) {
    return HDNode.fromSeedBuffer(new Buffer(hex, 'hex'), network);
  }
}

module.exports = HDNode;