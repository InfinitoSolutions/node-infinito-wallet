const Bip39 = require('bip39');
const Bip32 = require('bip32');
const slip44 = require('./slip44');
const Util = require('util');
const {
  AppError
} = require('infinito-util');
const Messages = require('./messages');


class HDNode {
  constructor(options) {
    if (options) {
      this.mnemonic = options.mnemonic;
      this.hdPath = options.hdPath;
    }
  }

  generateKeyPair(coinType, index, isTestNet, network) {
    if (!this.hdPath) {
      let coinIndex = isTestNet ? slip44.TESTNET : slip44[coinType.toUpperCase()];
      if (!coinIndex) {
        throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
      }
      if (!index) {
        index = 0
      }
      this.hdPath = "m/44'/" + coinIndex.index + "'/0'/0/" + index;
    }
    if (!this.mnemonic)
      this.mnemonic = this.generateMnomenic();
    let seed = this.mnemonicToSeed(this.mnemonic);
    let masterKeyPair = this.createMasterKeyPair(seed, network);
    this.keypair = this.createHDKeyPair(masterKeyPair, this.hdPath);
  }

  getHDPath() {
    return this.hdPath;
  }

  getWif() {
    return this.keypair.toWIF();
  }

  getPublicKey() {
    return this.keypair.publicKey
  }

  getMnemonic() {
    return this.mnemonic;
  }

  generateMnomenic() {
    return Bip39.generateMnemonic();
  }

  mnemonicToSeed(mnemonic) {
    return Bip39.mnemonicToSeed(mnemonic);
  }

  createMasterKeyPair(seed, network) {
    return Bip32.fromSeed(seed, network);
  }

  createHDKeyPair(master, hdPath) {
    return master.derivePath(hdPath);
  }
}

module.exports = HDNode;