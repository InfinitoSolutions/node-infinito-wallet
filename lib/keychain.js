const Bitcoinjs = require('bitcoinjs-lib');
const HdNode = require('./hdnode');
const SupportCoinType = require('./support_coin');
const Networks = require('./networks');
const { AppError } = require('infinito-util');

class Keychain {

  static getKeysFromPassPhrase({ mnomonic, hdPath, coinType, index }) {
    if (!mnomonic || (mnomonic && (!hdPath || !coinType))) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'mnomonic or missing one in coinType and hdPath'), Messages.missing_parameter.code);
    }

    let node = new HdNode({ mnomonic, hdPath });
    node.generateKeyPair(coinType, index);
    return {
      privateKey: node.getWif(),
      publicKey: node.getPublicKey().toString('hex')
    };
  }

  static getKeyPairFromWif(privateKey, coinType, isTestnet) {
    let keyPair = null;
    if (coinType == SupportCoinType.Bitcoin ||
      coinType == SupportCoinType.Bitcoin_Cash
    ) {
      let bitcoinNetwork = isTestnet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, bitcoinNetwork);
    } else if (coinType == SupportCoinType.NEO) {
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, Bitcoinjs.networks.bitcoin);
    } else if (coinType == SupportCoinType.Litecoin) {
      let litecoinNetwork = isTestnet ? Networks.litecoinTestnet : Networks.litecoin;
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, litecoinNetwork);
    } else if (coinType == SupportCoinType.Dash) {
      let dashNetwork = isTestnet ? Networks.dashTestnet : Networks.dash;
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, dashNetwork);
    } else if (coinType == SupportCoinType.Dogecoin) {
      let dogecoinNetwork = isTestnet ? Networks.dogecoinTestnet : Networks.dogecoin;
      keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, dogecoinNetwork);
    } else {
      throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
    }
    return {
      privateKey: keyPair.getWif(),
      publicKey: keyPair.getPublicKey().toString('hex'),

    };
  }
}

module.exports = Keychain;