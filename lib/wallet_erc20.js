const Wallet = require('./wallet');

class WalletErc20 extends Wallet {
  constructor(options) {
    super(options);
  }
}


module.exports = WalletErc20;