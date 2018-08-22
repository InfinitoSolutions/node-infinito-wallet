const Wallet = require('./wallet');

class Nep5Wallet extends Wallet {
  constructor(options) {
    super(options);
  }
}


module.exports = Nep5Wallet;