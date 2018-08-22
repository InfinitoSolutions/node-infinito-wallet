const Bitcoinjs = require('bitcoinjs-lib');
const Bip39 = require('bip39');
const Bip32 = require('bip32');
const HdNode = require('./hdnode');
const { AppError } = require('infinito-util');

class Keychain {

  static getKeysFromPassPhrase(passPhrase) {
    if (!passPhrase) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'passPhrase'), Messages.missing_parameter.code);
    }

    let node = new HdNode(passPhrase);
    node.generateKeyPair(passPhrase.coinType, passPhrase.index);
    return {
      privateKey: node.getWif(),
      publicKey: node.getPublicKey().toString('hex')
    };
  }
}

module.exports = Keychain;