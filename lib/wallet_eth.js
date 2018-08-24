const Messages = require('./messages');
const Util = require('util');
const { Logger, AppError, Helper } = require('node-infinito-util');
const Wallet = require('./wallet');
const coinType = require('./support_coin');
const Transaction = require('ethereumjs-tx');

class WalletEth extends Wallet {
  /** 
   * apiKey
   * secret
   * baseUrl
   * version
   * logger
   * logLevel 
   */

  constructor(options) {
    if (!options.coinType) {
      options.coinType = coinType.ETH.symbol;
    }
    super(options);
  }

  async send() {

  }

  /**
 * Create raw transaction
 *
 * @example
 *  var txParams = {
 *      from: "0x9c729ef4cec1b1bdffaa281c2ff76b48fdcb874c",
 *      to: "0xfd2921b8b8f0dccf65d4b0793c3a2e5c127f3e86",
 *      value: 12,
 *      nonce: 1,
 *      gasLimit: 300000,
 *      gasPrice: 20000000000,
 *      privateKey: '',
 *      nameFunc: 'commit', //Smart contract
 *      typeParams: ['uint256', 'bytes32'], //Smart contract
 *      paramsFuncs: [1, 2], //Smart contract
 *  };
 */
  createRawTx(txParams) {
    if (txParams.privateKey === undefined || txParams.privateKey === '' ||
      txParams.nonce === undefined || txParams.value === undefined || txParams.to === undefined)
      return '';
    let transaction = new Transaction();

    if (txParams.gasLimit === undefined) {
      txParams.gasLimit = Ethereum.GasLimit;
    }
    if (txParams.gasPrice === undefined) {
      txParams.gasPrice = Ethereum.GasPrice;
    }

    transaction.to = txParams.to;
    transaction.gasLimit = txParams.gasLimit * 1; // in wei
    transaction.gasPrice = txParams.gasPrice * 1; // in wei
    transaction.nonce = txParams.nonce * 1;
    transaction.value = txParams.value * 1; // in wei

    if (txParams.data !== undefined && txParams.data !== '') {
      transaction.data = txParams.data;
    }
    else if (txParams.nameFunc !== undefined && txParams.nameFunc !== '' &&
      txParams.typeParams !== undefined && txParams.paramsFuncs !== undefined) {
      let _data = Ethereum.getDataSmartContract(txParams.nameFunc, txParams.typeParams, txParams.paramsFuncs);
      transaction.data = '0x' + _data;
    }

    try {
      let privateKey = new Buffer(this.Account.privateKey, 'hex');
      transaction.sign(new Buffer(privateKey), "hex");
      return "0x" + transaction.serialize().toString("hex");
    } catch (error) {
      if (this.Account.privateKey.indexOf('0x') === 0) {
        try {
          let privateKey = this.Account.privateKey.substr(2);
          privateKey = new Buffer(privateKey, 'hex');
          transaction.sign(new Buffer(privateKey), "hex");
          return "0x" + transaction.serialize().toString("hex");
        } catch (error) {
          return '';
        }
      }
    }
    return '';
  }
}

module.exports = WalletEth;