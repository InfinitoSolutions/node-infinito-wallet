const AppError = require('./app_error');

class TransactionBuilder {

  /**
   * constructor
   */
  constructor() {
  }

  /**
   * Set api
   *
   * @param {*} api
   * @memberof TransactionBuilder
   */
  useApi(api) {
    this.api = api;
    return this;
  }

  /**
   * Set wallet
   *
   * @param {*} wallet
   * @returns
   * @memberof TransactionBuilder
   */
  useWallet(wallet) {
    this.wallet = wallet;
    return this;
  }

  /**
   * Build a transaction with specific type
   * 
   */
  build() {
    throw new Error('Cannot call abstract method');
  }

  /**
   * Broadcast raw transaction
   *
   * @param {*} rawTx
   * @returns
   * @memberof TransactionBuilder
   */
  async broadcast(rawTx) {
    let result = await this.api.sendTransaction({
      rawtx: rawTx
    });

    let response = _getReponse(result, Messages.send_transaction_fail.code);
    return {
      tx_id: response.txid,
      raw: response.raw
    };
  }

  /**
   * Build transaction and broadcast to server.
   *
   * @returns
   * @memberof TransactionBuilder
   */
  async buildAndBroadcast() {
    let buildResult = await this.build();
    return await this.broadcast(buildResult.raw);
  }

  /**
   * Get api respone message
   * 
   * @param {*} response
   * @param {*} code Error code 
   */
  _getReponse(response, code) {
    if (response.cd !== 0 && response.cd !== '0') {
      throw new AppError(response.msg, code);
    }
    return response.data;
  }
}

module.exports = TransactionBuilder;