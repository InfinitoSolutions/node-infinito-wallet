const Bitcoinjs = require('bitcoinjs-lib');
const Neon = require('@cityofzion/neon-js');
const HdNode = require('./hdnode');
const SupportCoinType = require('./support_coin');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('./messages');

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
      privateKey: node.getWif(),
      publicKey: node.getPublicKey().toString('hex')
    };
  }

  static getKeyPairFromWif(privateKey, coinType, isTestnet) {
    let network = this.getNetwork(coinType, isTestnet);
    if (!network) {
      throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
    }
    let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);

    return {
      privateKey: keyPair.toWIF(),
      publicKey: keyPair.publicKey.toString('hex')
    };
  }

  static getNetwork(coinType, isTestnet) {
    let network;
    switch (coinType) {
      case SupportCoinType.BTC.symbol:
      case SupportCoinType.BCH.symbol: {
        network = isTestnet ? SupportCoinType.BTC.network.testnet : SupportCoinType.BTC.network.mainnet;
        break;
      }
      case SupportCoinType.NEO.symbol: {
        network = SupportCoinType.BTC.network.mainnet
        break;
      }
      case SupportCoinType.LTC.symbol: {
        network = isTestnet ? SupportCoinType.LTC.network.testnet : SupportCoinType.LTC.network.mainnet;
        break;
      }
      case SupportCoinType.DSH.symbol: {
        network = isTestnet ? SupportCoinType.DSH.network.testnet : SupportCoinType.DSH.network.mainnet;
        break;
      }
      case SupportCoinType.DOGE.symbol: {
        network = isTestnet ? SupportCoinType.DOGE.network.testnet : SupportCoinType.DOGE.network.mainnet;
        break;
      }
    }
    return network;
  }
}

module.exports = Keychain;