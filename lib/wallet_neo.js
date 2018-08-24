const Messages = require('./messages');
const Util = require('util');
const InfinitApi = require('node-infinito-api');
const {
  Logger,
  AppError,
  Helper
} = require('node-infinito-util');
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
    console.log(options);
    let api = new InfinitApi(this.options);
    console.log(api['NEO'])
    this.infinitApi = api[options.coinType];
    this.Account = new NeoAccount(options);
  }

  setApi(api) {
    this.api = api;
    this.infinitApi = this.api[this.Account.coinType];
  }


  getApi() {
    return this.api;
  }

  async getBalance(asset_id) {
    return await this.infinitApi.getBalance(this.Account.address, asset_id);
  }

  async getHistory(offset, limit) {
    return await this.infinitApi.getHistory(this.Account.address, offset, limit);
  }

  async getAddressInfo() {
    return await this.infinitApi.getAddressInfo(this.Account.address);
  }

  async getUtxo(asset_id) {
    return await this.infinitApi.getUtxo(this.Account.address, asset_id);
  }

  async getClaimableGas() {
    return await this.infinitApi.getClaimableGas(this.Account.address);
  }

  async getUnclaimedGas() {
    return await this.infinitApi.getUnclaimedGas(this.Account.address);
  }

  async sendTransaction() {
    return await this.infinitApi.sendTransaction();
  }

  async getContractInfo(sc_address) {
    return await this.infinitApi.getContractInfo(sc_address);
  }

  async getNEP5Balance(sc_address) {
    return await this.infinitApi.getNEP5Balance(sc_address, this.Account.address);
  }

  async getNEP5History(sc_address, offset, limit) {
    return await this.infinitApi.getNEP5History(sc_address, offset, limit);
  }
}

module.exports = WalletNeo;