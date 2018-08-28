const Bitcoinjs = require('bitcoinjs-lib');
const HdNode = require('./hdnode');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('./messages');
const wif = require('wif')

class Keychain {

  static getKeyPairFromPassPhrase({
    mnemonic,
    hdPath,
    coinType,
    index,
    isTestNet
  }) {
    if (!coinType) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'coinType'), Messages.missing_parameter.code);
    }

    let node = new HdNode({
      mnemonic,
      hdPath
    });
    node.generateKeyPair(coinType, index, isTestNet);
    return {
      privateKey: node.getPrivateKey(),
      publicKey: node.getPublicKey()
    };
  }

  static getKeyPairFromWif(wif, coinType, isTestNet) {
    let network = HdNode.getNetwork(coinType, isTestNet);
    if (!network) {
      throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
    }
    let keyPair = Bitcoinjs.ECPair.fromWIF(wif, network);

    return {
      privateKey: keyPair.getPrivateKey(),
      publicKey: keyPair.getPublicKey()
    };
  }

  static getKeyPairFromPrivateKey(privateKey) {
    if (typeof (privateKey) == 'string')
      privateKey = Buffer.from(privateKey, 'hex');
    else if (typeof (privateKey) != 'buffer') {
      throw new AppError(Util.format(Messages.invalid_type.message, 'private key'), Messages.invalid_type.code);
    }
    let keyPair = Bitcoinjs.ECPair.fromPrivateKey(privateKey);
    return {
      privateKey: keyPair.getPrivateKey(),
      publicKey: keyPair.getPublicKey()
    };
  }

  static getWif(privateKey, network) {
    try {
      wif.decode(privateKey);
      return privateKey
    }
    catch {
      return wif.encode(network.wif, new Buffer(privateKey, 'hex'), true);
    }
  }
}

module.exports = Keychain;