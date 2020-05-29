const { AppError, TransactionBuilder, TomoereumFunction } = require('infinito-wallet-core');
const Messages = require('./messages');

class TomoTxBuilder extends TransactionBuilder {
  constructor(platform = 'TOMO') {
    super();
    this.platform = platform;
  }

}

module.exports = TomoTxBuilder;