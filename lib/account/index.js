const coinType = require('../support_coin');
const BitcoinAccount = require('./bitcoin');
const BitcoinCashAccount = require('./bitcoin_cash');

const { AppError } = require('infinito-util');
const Messages = require('../messages');
const Util = require('util');

class Account {
  constructor(options) {
    console.log(JSON.stringify(options));
    let account = null;
    switch (options.coinType) {
      case coinType.Bitcoin: {
        account = new BitcoinAccount(options);
        break;
      }
      case coinType.Bitcoin_Cash: {
        account = new BitcoinCashAccount(options);
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
