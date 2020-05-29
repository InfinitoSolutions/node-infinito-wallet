const { AppError, TransactionBuilder, AdaereumFunction } = require('infinito-wallet-core');
const Messages = require('./messages');

class AdaTxBuilder extends TransactionBuilder {
  constructor(platform = 'ADA') {
    super();
    this.platform = platform;
  }

}

module.exports = AdaTxBuilder;