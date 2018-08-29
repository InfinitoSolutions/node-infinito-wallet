const CoinType = require('../coin_type');
const BitcoinAccount = require('./bitcoin');
const EthAccount = require('./eth');
const NeoAccount = require('./neo');
const { AppError } = require('node-infinito-util');
const Messages = require('../messages');
const Util = require('util');

class Account {
  constructor(options) {
    let account;
    switch (options.coinType) {
      case CoinType.BTC.symbol:
      case CoinType.BCH.symbol: {
        account = new BitcoinAccount(options);
        break;
      }
      case CoinType.ETH.symbol:
      case CoinType.ETC.symbol: {
        account = new EthAccount(options);
        break;
      }
      case CoinType.NEO.symbol: {
        account = new NeoAccount(options);
        break;
      }
      default: {
        throw new AppError(Util.format(Messages.invalid_cointype.message, options.coinType), Messages.invalid_cointype.code);
      }
    }

    if (!account) {
      throw Error('Don\'t exists account type');
    }
    return account;
  }
}


module.exports = Account; 