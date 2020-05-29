const { AppError, TransactionBuilder, FioereumFunction } = require('infinito-wallet-core');
const Messages = require('./messages');

class FioTxBuilder extends TransactionBuilder {
  constructor(platform = 'FIO') {
    super();
    this.platform = platform;
  }

}

module.exports = FioTxBuilder;