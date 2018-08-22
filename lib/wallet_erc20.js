const Wallet = require('./wallet');

class Erc20Wallet extends Wallet {
  constructor(options) {
    super(options);
  }
}


module.exports = Erc20Wallet;