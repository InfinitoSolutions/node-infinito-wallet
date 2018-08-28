const Messages = require('./messages');
const Util = require('util');
const { Logger, AppError } = require('node-infinito-util');
const Wallet = require('./wallet');
const coinType = require('./support_coin');
const Transaction = require('ethereumjs-tx');
const Abi = require('ethereumjs-abi');
const WalletHelper = require('./helper');

class WalletEth extends Wallet {
  /** 
    * options.mnemonic,
    * options.index,
    * options.hdPath,
    * options.privateKey,
    * options.coinType
    * options.isTestNet
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
 *      gasPrice: 20000000000
 *  };
 */
  async send({ rawTx, txParams, isBroadCast = true }) {
    let rawTxData = rawTx;
    if (!rawTxData) {
      rawTxData = await this.createRawTx(txParams);
      console.log('rawTxData', rawTxData);
      if (!rawTxData) {
        return {
          cd: 1,
          message: 'Cannot create rawtx'
        }
      }
    }

    if (isBroadCast) {
      let result = await this.infinitApi.sendTransaction({
        rawtx: rawTxData
      });
      console.log('rawTx:' + rawTxData);
      console.log(result);
      if (result.cd !== 0) {
        return result;
      }
    }

    return {
      cd: 0,
      data: {
        rawTx: rawTxData
      }
    }
  }

  async transfer(contractAddress, to, value) {
    let txParams = {};
    txParams.sc = {};
    txParams.to = contractAddress;
    txParams.value = value;
    txParams.sc.contractAddress = contractAddress;
    txParams.sc.nameFunc = 'transfer';
    txParams.sc.typeParams = ['address', 'uint256'];
    txParams.sc.paramsFuncs = [to, value];

    let crawTx = await this.createRawTx(txParams);
    return await this.send({
      rawTx: crawTx,
      isBroadCast: true
    })
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
   *      sc:{
   *        contractAddress, //Smart contract
   *        nameFunc: 'transfer', //Smart contract
   *        typeParams: ['uint256', 'bytes32'], //Smart contract,
   *        paramsFuncs: [1, 2], //Smart contract,
   *      }
   *  };
   */

  async createRawTx(txParams) {
    if (!txParams.nonce) {
      let nonce = await this.infinitApi.getNonce();
      txParams.nonce = nonce.nonce;
    }
    if (!txParams.nonce || !txParams.value || !txParams.to) {
      return '';
    }

    txParams.from = this.Account.address;
    txParams.privateKey = this.Account.privateKey;
    let transaction = new Transaction();

    if (!txParams.gasLimit) {
      txParams.gasLimit = this.getDefaultGasLimit();
    }
    if (!txParams.gasPrice) {
      txParams.gasPrice = this.getDefaultGasPrice();
    }

    transaction.to = txParams.to;
    transaction.gasLimit = txParams.gasLimit;
    transaction.gasPrice = txParams.gasPrice;
    transaction.nonce = txParams.nonce;
    transaction.value = txParams.value;

    if (txParams.data) {
      transaction.data = txParams.data;
    }
    else if (txParams.sc &&
      txParams.sc.nameFunc &&
      txParams.sc.typeParams &&
      txParams.sc.paramsFuncs) {
      let _data = this.getDataSmartContract(txParams.sc.nameFunc, txParams.sc.typeParams, txParams.sc.paramsFuncs);
      transaction.data = '0x' + _data;
      transaction.to = txParams.sc.contractAddress;
      transaction.value = 0;
    }

    try {
      let privateKey = this.Account.privateKey.indexOf('0x') === 0 ?
        (new Buffer(this.Account.privateKey.substr(2), 'hex')) :
        (new Buffer(this.Account.privateKey, 'hex'));

      transaction.sign(new Buffer(privateKey), "hex");
      return '0x' + transaction.serialize().toString("hex");
    }
    catch (error) {
      console.log('error', error);
    }
    return '';
  }

  getDataSmartContract(nameFunction, typeParams, Params) {
    return Abi.methodID(nameFunction, typeParams).toString('hex') + Abi.rawEncode(typeParams, Params).toString('hex');
  }

  getDefaultGasLimit() {
    return 300000;
  }

  getDefaultGasPrice() {
    return 20000000000;
  }
}

module.exports = WalletEth;