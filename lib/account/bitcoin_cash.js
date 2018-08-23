const BitcoinAccount = require('./bitcoin');

class BitcoinCashAccount extends BitcoinAccount {
  constructor(options) {
    super(options);
  }
}

module.exports = BitcoinCashAccount;