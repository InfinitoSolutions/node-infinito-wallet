const Messages = require('./messages');
const Util = require('util');
const { Logger, AppError, Helper } = require('node-infinito-util');
const Wallet = require('./wallet');
const coinType = require('./support_coin');

class WalletEos extends Wallet {
  /** 
   * apiKey
   * secret
   * baseUrl
   * version
   * logger
   * logLevel 
   */

  constructor(options) {
    super(options);
  }

  async transfer() {

  }
}

module.exports = WalletEos;