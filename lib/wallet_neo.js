const Messages = require('./messages');
const Util = require('util');
const {
  Logger,
  AppError,
  Helper
} = require('node-infinito-util');
const coinType = require('./support_coin');
const NeoAccount = require('./account/neo');

class WalletNeo {
  /** 
   * apiKey
   * secret
   * baseUrl
   * version
   * logger
   * logLevel 
   */

  constructor(options) {
    this.options = options;
    this.infinitApi = new InfinitApi(this.options);
    this.Account = new NeoAccount(options);
  }

  setApi(api) {
    this.api = api;
    this.infinitApi = this.api[this.Account.coinType];
  }


  getApi() {
    return this.api;
  }

  async getBalance() {
    return await this.infinitApi.getBalance(this.address);
  }

}

module.exports = WalletNeo;