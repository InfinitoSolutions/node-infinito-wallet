const Bip39 = require('bip39');
const Bip32 = require('bip32');
const BIP44 = require('bip44-constants');
const Util = require('util');
const {
  AppError
} = require('node-infinito-util');
const Messages = require('./messages');
const CoinType = require('./support_coin');


class HDNode {
  constructor(options) {
    if (options) {
      this.mnemonic = options.mnemonic;
      this.hdPath = options.hdPath;
    }
  }

  getCoinIndexBip44(coinType) {
    if (coinType == "TESTNET")
      return 1;
    return BIP44[coinType] - BIP44['BTC'];
  }

  generateKeyPair(coinType, index, isTestNet) {
    let network = isTestNet ? CoinType[coinType].network.testnet : CoinType[coinType].network.mainnet;
    if (coinType == CoinType.NEO.symbol) {
      network = CoinType.BTC.network.mainnet;
    }
    if (!this.hdPath) {
      let coinIndex = isTestNet ? this.getCoinIndexBip44("TESTNET") : this.getCoinIndexBip44(coinType.toUpperCase());
      if (!coinIndex) {
        throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
      }
      if (!index) {
        index = 0
      }
      this.hdPath = "m/44'/" + coinIndex + "'/0'/0/" + index;
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