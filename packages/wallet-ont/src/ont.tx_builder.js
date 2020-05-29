const { AppError, TransactionBuilder, OntereumFunction } = require('infinito-wallet-core');
const Messages = require('./messages');
const Ontio = require('ontology-ts-sdk');

class OntTxBuilder extends TransactionBuilder {
  constructor(platform = 'ONT') {
    super();
    this.platform = platform;
  }

}

module.exports = OntTxBuilder;