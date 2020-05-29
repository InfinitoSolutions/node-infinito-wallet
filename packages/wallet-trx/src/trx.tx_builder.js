const { AppError, TransactionBuilder, TrxereumFunction } = require('infinito-wallet-core');
const TronWeb = require("tronweb");
const Messages = require('./messages');

class TrxTxBuilder extends TransactionBuilder {
  constructor(platform = 'TRX') {
    super();
    this.platform = platform;
  }

  /**
   * create raw Tx
   * 
   * @param {*} txParams 
   */
  async createRawTx(txParams) {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io'
    });
    try {
      if (txParams.rawTx) {
        let rawtx = await tronWeb.trx.sign(txParams.rawTx, txParams.privateKey);
        return rawtx;
      }
      return null
    } catch (error) {
      return null
    }
  }

}

module.exports = TrxTxBuilder;