const Messages = require('./messages');
const Util = require('util');
const { Logger, AppError, Helper } = require('infinito-util');
const InfinitApi = require('node-infinito-api');
const Account = require('./account');
const coinType = require('./support_coin');

class Wallet {

  /** 
   * apiKey
   * secret
   * baseUrl
   * version
   * logger
   * logLevel 
   */
  constructor(options) {
    console.log('options:' + JSON.stringify(options));
    this._check(options);
    this.options = options;
    this.infinitApi = new InfinitApi(this.options);
    this.Accounts = [];
  }

  addAccount(account) {
    if (!this._checkAccountType(account)) {
      throw new AppError(Util.format(Messages.invalid_account.message, 'account'), Messages.invalid_account.code);
    }
    account.setInfinitApi(this.infinitApi[account.coinType]);
    this.Accounts[account.coinType] = account;
  }

  createAccount({ mnemonic, hdPath, privateKey, coinType, index, isTestNet }) {
    let account = new Account({ mnemonic, hdPath, privateKey, coinType, index, isTestNet });
    account.setInfinitApi(this.infinitApi[account.coinType]);
    this.Accounts[account.coinType] = account;
  }

  _check(params) {
    if (!params) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'params'), Messages.missing_parameter.code);
    }
  }

  _checkAccountType(account) {
    return true;
  }
}


// let wallet = new Wallet();
// wallet.addAccount(btcaccount);
// wallet.createAccount();
// wallet.Accounts[coinType.Bitcoin].send('', '');
// wallet.Accounts[coinType.Bitcoin].getBalance();
// wallet.Accounts[coinType.Ether].transfer();

module.exports = Wallet;