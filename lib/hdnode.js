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
    if (coinType == 'TESTNET')
      return 1;
    return BIP44[coinType] - BIP44['BTC'];
  }

  generateKeyPair(coinType, index, isTestNet) {
    let network = HDNode.getNetwork(coinType, isTestNet);
    if (!this.hdPath) {
      let coinIndex = isTestNet ? this.getCoinIndexBip44('TESTNET') : this.getCoinIndexBip44(coinType.toUpperCase());
      if (!coinIndex) {
        throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
      }
      if (!index) {
        index = 0;
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
    return this.keypair.publicKey;
  }

  getPrivateKey() {
    return this.keypair.privateKey;
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

  static getNetwork(coinType, isTestnet) {
    let network;
    switch (coinType) {
      case CoinType.BTC.symbol:
      case CoinType.BCH.symbol:
        {
          network = isTestnet ? CoinType.BTC.network.testnet : CoinType.BTC.network.mainnet;
          break;
        }
      case CoinType.ETC.symbol:
      case CoinType.ETH.symbol:
        {
          network = CoinType.BTC.network.mainnet;
          break;
        }
      case CoinType.NEO.symbol:
        {
          network = CoinType.BTC.network.mainnet;
          break;
        }
      case CoinType.LTC.symbol:
        {
          network = isTestnet ? CoinType.LTC.network.testnet : CoinType.LTC.network.mainnet;
          break;
        }
      case CoinType.DSH.symbol:
        {
          network = isTestnet ? CoinType.DSH.network.testnet : CoinType.DSH.network.mainnet;
          break;
        }
      case CoinType.DOGE.symbol:
        {
          network = isTestnet ? CoinType.DOGE.network.testnet : CoinType.DOGE.network.mainnet;
          break;
        }
    }

    return network;
  }
}

module.exports = HDNode;