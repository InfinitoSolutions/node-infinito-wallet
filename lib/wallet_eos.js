const Wallet = require('./wallet');

class WalletEOS extends Wallet {
  constructor(options) {
    super(options);
  }
}


module.exports = WalletEOS;