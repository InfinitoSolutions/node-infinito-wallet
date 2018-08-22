const Bip39 = require('bip39');
const Bip32 = require('bip32');
const slip44 = require('./slip44');
const {
  AppError
} = require('infinito-util');

class HDNode {
  constructor(options) {
    if (options) {
      this.mnemonic = options.mnemonic;
      this.hdPath = options.hdPath;
    }
  }

  generateKeyPair(coinType, index) {
    if (!this.hdPath) {
      let coinIndex = slip44[coinType.toUpperCase()];
      if (!coinIndex) {
        throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
      }
      if (!index)
        this.hdPath = "m/44'/" + coinIndex.index + "'/0'/0/" + 0;
      else
        this.hdPath = "m/44'/" + coinIndex.index + "'/0'/0/" + index;
    }
    if (!this.mnemonic)
      this.mnemonic = this.generateMnomenic();
    let seed = this.mnemonicToSeed(this.mnemonic);
    let masterKeyPair = this.createMasterKeyPair(seed);
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

  createMasterKeyPair(seed) {
    return Bip32.fromSeed(seed);
  }

  createHDKeyPair(master, hdPath) {
    return master.derivePath(hdPath);
  }
}

module.exports = HDNode;