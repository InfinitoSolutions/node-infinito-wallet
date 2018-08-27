const Bitcoinjs = require('bitcoinjs-lib');
const Neon = require('@cityofzion/neon-js');
const HdNode = require('./hdnode');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('./messages');
const CoinType = require('./support_coin');

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
    let network = this.getNetwork(coinType, isTestNet);
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

  static getNetwork(coinType, isTestnet) {
    let network;
    switch (coinType) {
      case CoinType.BTC.symbol:
      case CoinType.BCH.symbol: {
        network = isTestnet ? CoinType.BTC.network.testnet : CoinType.BTC.network.mainnet;
        break;
      }
      case CoinType.ETC.symbol:
      case CoinType.ETH.symbol: {
        network = CoinType.BTC.network.mainnet;
        break;
      }
      case CoinType.NEO.symbol: {
        network = CoinType.BTC.network.mainnet
        break;
      }
      case CoinType.LTC.symbol: {
        network = isTestnet ? CoinType.LTC.network.testnet : CoinType.LTC.network.mainnet;
        break;
      }
      case CoinType.DSH.symbol: {
        network = isTestnet ? CoinType.DSH.network.testnet : CoinType.DSH.network.mainnet;
        break;
      }
      case CoinType.DOGE.symbol: {
        network = isTestnet ? CoinType.DOGE.network.testnet : CoinType.DOGE.network.mainnet;
        break;
      }
    }

    return network;
  }
}

module.exports = Keychain;