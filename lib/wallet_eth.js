const Messages = require('./messages');
const Util = require('util');
const { Logger, AppError, Helper } = require('node-infinito-util');
const Wallet = require('./wallet');
const coinType = require('./support_coin');
const Transaction = require('ethereumjs-tx');
var Abi = require('ethereumjs-abi');

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

  async getNonce() {
    let result = await this.infinitApi.getNonce(this.Account.address);
    return this._getReponse(result);
  }

  async getTxCount() {
    let result = await this.infinitApi.getTxCount(this.Account.address);
    return this._getReponse(result);
  }

  async getTxAddress(offset, limit) {
    let result = await this.infinitApi.getTxAddress(this.Account.address, offset, limit);
    return this._getReponse(result);
  }

  async getInternalTxAddress(offset, limit) {
    let result = await this.infinitApi.getInternalTxAddress(this.Account.address, offset, limit);
    return this._getReponse(result);
  }

  async getContract() {
    let result = await this.infinitApi.getContract();
    return this._getReponse(result);
  }

  async getSmartContractInfo(scAddress) {
    let result = await this.infinitApi.getSmartContractInfo(scAddress);
    return this._getReponse(result);
  }

  async getContractHistory(scAddress, offset, limit) {
    let result = await this.infinitApi.getContractHistory(scAddress, offset, limit, this.Account.address);
    return this._getReponse(result);
  }

  async getContractBalance(scAddress) {
    let result = await this.infinitApi.getContractBalance(scAddress, this.Account.address);
    return this._getReponse(result);
  }

  /**
 * Send
 *
 * @example
 *  var txParams = { 
 *      to: "0xfd2921b8b8f0dccf65d4b0793c3a2e5c127f3e86",
 *      value: 12,
 *      nonce: 1,
 *      gasLimit: 300000,
 *      gasPrice: 20000000000, 
 *      nameFunc: 'commit', //Smart contract
 *      typeParams: ['uint256', 'bytes32'], //Smart contract
 *      paramsFuncs: [1, 2], //Smart contract
 *  };
 */
  async send(txParams) {
    let rawTx = this.createRawTx(txParams);
    if (!rawTx) {
      return {
        cd: 1,
        message: rawTx.error
      }
    }

    if (isBroadCast) {
      let result = await this.infinitApi.sendTransaction({
        rawtx: rawTx
      });
      console.log('rawTx:' + rawTx);
      console.log(result);
      if (result.cd !== 0) {
        return result;
      }
    }

    return {
      cd: 0,
      data: {
        rawTx: rawTx
      }
    }
  }

  /**
   * Create raw transaction
   *
   * @example
   *  var txParams = { 
   *      to: "0xfd2921b8b8f0dccf65d4b0793c3a2e5c127f3e86",
   *      value: 12,
   *      nonce: 1,
   *      gasLimit: 300000,
   *      gasPrice: 20000000000, 
   *      nameFunc: 'commit', //Smart contract
   *      typeParams: ['uint256', 'bytes32'], //Smart contract
   *      paramsFuncs: [1, 2], //Smart contract
   *  };
   */
  createRawTx(txParams) {
    if (!txParams.nonce) {
      let nonce = await this.infinitApi.getNonce();
      txParams.nonce = nonce;
    }
    if (!txParams.nonce || !txParams.value || !txParams.to) {
      return '';
    }

    txParams.from = this.Account.address;
    txParams.privateKey = this.Account.privateKey;
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

    if (txParams.data) {
      transaction.data = txParams.data;
    }
    else if (txParams.nameFunc !== undefined && txParams.nameFunc !== '' &&
      txParams.typeParams !== undefined && txParams.paramsFuncs !== undefined) {
      let _data = this.getDataSmartContract(txParams.nameFunc, txParams.typeParams, txParams.paramsFuncs);
      transaction.data = '0x' + _data;
    }

    try {
      let privateKey = new Buffer(this.Account.privateKey, 'hex');
      transaction.sign(new Buffer(privateKey), "hex");
      return "0x" + transaction.serialize().toString("hex");
    }
    catch (error) {
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

  getDataSmartContract(nameFunction, typeParams, Params) {
    return Abi.methodID(nameFunction, typeParams).toString('hex') + Abi.rawEncode(typeParams, Params).toString('hex');
  }
}

module.exports = WalletEth;