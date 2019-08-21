// const TransactionBuilder = require('../core/transaction_builder');
const TransactionBuilder = require('../../wallet-core/src/transaction_builder');

class BtcTxBuilder extends TransactionBuilder {
  constructor() {
    super();
    console.log('BtcTxBuilder :');
    
  }

  async send({fee, type}){
    console.log('send :');
  }
}

module.exports = BtcTxBuilder;