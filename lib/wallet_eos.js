const Wallet = require('./wallet');

class EOSWallet extends Wallet {
  constructor(options) {
    super(options);
  }
}

module.exports = EOSWallet;