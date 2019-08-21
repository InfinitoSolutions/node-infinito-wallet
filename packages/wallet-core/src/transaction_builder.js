class TransactionBuilder {
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

  build() {
    // Return raw transaction
    // console.log('this.wallet :', this.wallet);
    // console.log('TransactionBuilder.build', this.wallet.getAddress());
    return this.wallet.getAddress();
  }
}

module.exports = TransactionBuilder;