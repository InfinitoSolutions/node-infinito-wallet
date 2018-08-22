const Bip39 = require('bip39');
const Bip32 = require('bip32');
const slip44 = require('./slip44');

class HDNode {
  constructor(options) {
    if (options) {
      this.mnemonic = options.mnemonic;
      this.hdPath = options.hdPath;
    }
  }

  generateKeyPair(coinType, index) {
    if (!this.hdPath) {
      let coinIndex = slip44[coinType.toUpperCase()].index;
      if (!index)
        this.hdPath = "m/44'/" + coinIndex + "'/0'/0/" + 0;
      else
        this.hdPath = "m/44'/" + coinIndex + "'/0'/0/" + index;
    }
    if (!this.mnemonic)
      this.mnemonic = this.generateMnomenic();
    let seed = this.mnemonicToSeed(mnemonic);
    let masterKeyPair = this.createMasterKeyPair(seed);
    this.keypair = this.createHDKeyPair(masterKeyPair, this.hdPath);
  }

  getHDPath() {
    return this.hdPath;
  }

  getWif() {
    return this.keypair.toWif();
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
    return keyPair = master.derivePath(hdPath);
  }
}

module.exports = HDNode;