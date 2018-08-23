const Bitcoinjs = require('bitcoinjs-lib');
const HdNode = require('./hdnode');
const SupportCoinType = require('./support_coin');
const Networks = require('./networks');
const { AppError } = require('infinito-util');
const Util = require('util');
const Messages = require('./messages');

class Keychain {

  static getKeysFromPassPhrase({ mnemonic, hdPath, coinType, index, isTestNet }) {
    if (!coinType) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'coinType'), Messages.missing_parameter.code);
    }

    let node = new HdNode({ mnemonic, hdPath });
    node.generateKeyPair(coinType, index, isTestNet);
    return {
      privateKey: node.getWif(),
      publicKey: node.getPublicKey().toString('hex')
    };
  }

  static getKeyPairFromWif(privateKey, coinType, isTestnet) {
    let keyPair = null;
    if (coinType == SupportCoinType.BTC.symbol ||
      coinType == SupportCoinType.BCH.symbol
    ) {
      let bitcoinNetwork = isTestnet ? SupportCoinType.BTC.network.testnet : SupportCoinType.BTC.network.mainnet;
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, bitcoinNetwork);
    } else if (coinType == SupportCoinType.NEO.symbol) {
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, SupportCoinType.BTC.network.mainnet);
    } else if (coinType == SupportCoinType.LTC.symbol) {
      let litecoinNetwork = isTestnet ? SupportCoinType.LTC.network.testnet : SupportCoinType.LTC.network.mainnet;
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, litecoinNetwork);
    } else if (coinType == SupportCoinType.DSH.symbol) {
      let dashNetwork = isTestnet ? SupportCoinType.DSH.network.testnet : SupportCoinType.DSH.network.mainnet;
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, dashNetwork);
    } else if (coinType == SupportCoinType.DOGE.symbol) {
      let dogecoinNetwork = isTestnet ? SupportCoinType.DOGE.network.testnet : SupportCoinType.DOGE.network.mainnet;
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, dogecoinNetwork);
    } else {
      throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
    }
    return {
      privateKey: keyPair.getWif(),
      publicKey: keyPair.getPublicKey().toString('hex')
    };
  }
}

module.exports = Keychain;