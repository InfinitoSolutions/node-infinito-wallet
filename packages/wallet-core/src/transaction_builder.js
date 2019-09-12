class TransactionBuilder {

  /**
   * constructor
   */
  constructor() {
    console.log('TransactionBuilder');
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
}

module.exports = TransactionBuilder;