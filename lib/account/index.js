const coinType = require('../support_coin');
const BitcoinAccount = require('./bitcoin');
const Messages = require('../messages');

class Account {
  constructor(options) {
    let account = null;
    switch (options.coinType) {
      case coinType.Bitcoin: {
        account = new BitcoinAccount(options);
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
