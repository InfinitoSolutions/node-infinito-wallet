const Messages = require('./messages');
const Util = require('util');
const { TokenProvider, Logger, AppError, Helper } = require('infinito-util');
const InfinitApi = require('node-infinito-api');
const Factory = require('./factory');

class Wallet {

  /**
   * passPhrase: {
   *   seed:'',
   *   index:0,
   *   hdPath:'m/44'/888'/0'/0'
   * } 
   * privateKey
   * isTestNet
   * apiKey
   * secret
   * baseUrl
   * version
   * logger
   * logLevel
   */

  constructor({ passPhrase, privateKey, ...options }) {
    this._check(options);
    this.options = options;
    let api = new InfinitApi(this.options);
    this.wallet = null;
    this.infinitApi = api[this.wallet.coin];

  }

  async getBalance() {
    return await this.infinitApi.getBalance(this.wallet.address);
  }

  send() {

  }

  async getHistory(offset, limit) {
    return await this.infinitApi.getHistory(this.wallet.address, offset, limit);
  }

  _check(params) {
    if (!params) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }
  }
}

module.exports = Wallet;