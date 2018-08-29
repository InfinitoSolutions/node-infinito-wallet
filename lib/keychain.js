const HdNode = require('./hdnode');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('./messages');
const wif = require('wif');

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

  static getWif(privateKey, network) {
    try {
      wif.decode(privateKey);
      return privateKey;
    } catch (err) {
      return wif.encode(network.wif, new Buffer(privateKey, 'hex'), true);
    }
  }
}

module.exports = Keychain;