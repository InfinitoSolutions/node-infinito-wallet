const Messages = require('./messages');
const Util = require('util');
const { AppError } = require('node-infinito-util');
const CoinType = require('./coin_type');
const BtcWallet = require('./wallet_btc');
const BchWallet = require('./wallet_bch');
const EthWallet = require('./wallet_eth');
const NeoWallet = require('./wallet_neo');
const OmniWallet = require('./wallet_omni');
class Wallet {
  /**
   * @constructor
   * @param  {Object}  options
   * @param  {String}  options.privateKey      (optional) coin's private key or WIF
   * @param  {String}  options.mnemonic        (optional) mnemonic
   * @param  {String}  options.hdPath          (optional) hdPath (based on standard BIP44)
   * @param  {Number}  options.index           (optional) index (based on standard BIP44)
   * @param  {String}  options.coinType        (required) Coin type (BTC|BCH...)
   * @param  {Boolean} options.isTestNet       (optional) Environment type (default = false))
   */
  constructor(options = {}) {
    let wallet;
    switch (options.coinType) {
      case CoinType.BTC.symbol:
      case CoinType.DOGE.symbol:
      case CoinType.LTC.symbol:
      case CoinType.DASH.symbol:
        {
          wallet = new BtcWallet(options);
          break;
        }
      case CoinType.BCH.symbol:
        {
          wallet = new BchWallet(options);
          break;
        }
      case CoinType.ETH.symbol:
      case CoinType.ETC.symbol:
        {
          wallet = new EthWallet(options);
          break;
        }
      case CoinType.NEO.symbol:
        {
          wallet = new NeoWallet(options);
          break;
        }
        case CoinType.OMNI.symbol:
        {
          wallet = new OmniWallet(options);
          break;
        }
      default:
        {
          throw new AppError(
            Util.format(Messages.invalid_cointype.message, options.coinType),
            Messages.invalid_cointype.code
          );
        }
    }

    return wallet;
  }
}

module.exports = Wallet;