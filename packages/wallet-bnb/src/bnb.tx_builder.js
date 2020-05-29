const { AppError, TransactionBuilder, BnbereumFunction } = require('infinito-wallet-core');
const Messages = require('./messages');

class BnbTxBuilder extends TransactionBuilder {
  constructor(platform = 'BNB') {
    super();
    this.platform = platform;
  }

}

module.exports = BnbTxBuilder;