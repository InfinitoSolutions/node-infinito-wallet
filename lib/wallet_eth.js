const Messages = require('./messages');
const {
  AppError
} = require('node-infinito-util');
const Wallet = require('./wallet');
const CoinType = require('./coin_type');
const Transaction = require('ethereumjs-tx');
const Abi = require('ethereumjs-abi');
const Constant = require('./constant');

class EthWallet extends Wallet {

  /**
 * @constructor
 * @param  {Object}  options
 * @param  {String}  options.privateKey      (optional) coin's private key or WIF 
 * @param  {String}  options.mnemonic        (optional) mnemonic 
 * @param  {String}  options.hdPath          (optional) hdPath (based on standard BIP44)
 * @param  {Number}  options.index           (optional) index (based on standard BIP44)
 * @param  {String}  options.coinType        (required) Coin type (BTC|BCH...)
 * @param  {Boolean} options.isTestNet       (optional) Environment type (default = false))
 */
  constructor(options) {
    if (!options.coinType) {
      options.coinType = CoinType.ETH.symbol;
    }
    super(options);
  }

  async getNonce() {
    console.log('this.Account.address', this.Account.address);
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
   * send transaction using rawTx if you have rawTx already or pass txParams in order to build rawTx. rawTx is priority
   * @param {String}  {rawTx                          (optional)  raw transaction
   * @param {String} txParams.to                      (required) Adddress receiver
   * @param {Number} txParams.amount                  (required) Amount coin (WEI)
   * @param {Number} txParams.nonce                   (optional) nonce
   * @param {Number} txParams.gasLimit                (optional) gasLimit
   * @param {Number} txParams.gasPrice                (optional) Fee that you want to pay for this transaction, if dont set you can use gasPriceType. gasPrice is priority than gasPriceType
   * @param {Number} txParams.gasPriceType            (optional) auto get fee transaction (low|medium|high). default medium
   * @param {String} txParams.sc.contractAddress      (optional) Adddress smart contract
   * @param {String} txParams.sc.nameFunc             (optional) name of function smart contract
   * @param {Array[String]} txParams.sc.typeParams    (optional) type of params function smart contract
   * @param {Array[Object]]} txParams.sc.paramsFuncs  (optional) value of params function smart contract
   * @param {Boolean} isBroadCast=true }      (optional)  Send this transaction or just create raw
   * @returns {Object}  {raw:'',tx_id:''}
   */

  async send({
    rawTx,
    txParams,
    isBroadCast = true
  }) {
    let rawTxData = rawTx;
    if (!rawTxData) {
      rawTxData = await this.createRawTx(txParams);
      if (!rawTxData) {
        throw new AppError(Messages.create_crawtx_fail.message, Messages.create_crawtx_fail.code);
      }
    }

    if (isBroadCast) {
      let result = await this.infinitApi.sendTransaction({
        rawtx: rawTxData
      });
      if (result.cd === 0) {
        return Object.assign(result.data, {
          raw: rawTxData
        });
      } else {
        throw new AppError(result.message, Messages.create_transaction_fail.code);
      }
    }

    return {
      raw: rawTxData
    }
  }


  /**
   * @param  {String} contractAddress       (required) Adddress smart contract
   * @param  {String} to                    (required) Adddress receiver
   * @param  {Number} amount                (required) Amount token/coin
   * @returns {Object}   {raw:'',tx_id:''}
   */
  async transfer(contractAddress, to, amount) {
    let txParams = {};
    txParams.sc = {};
    txParams.to = contractAddress;
    txParams.amount = amount;
    txParams.sc.contractAddress = contractAddress;
    txParams.sc.nameFunc = 'transfer';
    txParams.sc.typeParams = ['address', 'uint256'];
    txParams.sc.paramsFuncs = [to, amount];

    let crawTx = await this.createRawTx(txParams);
    return await this.send({
      rawTx: crawTx,
      isBroadCast: true
    });
  }

  /**
   * @param {Object} txParams                         (required) Params in order to create rawtx
   * @param {String} txParams.to                      (required) Adddress receiver
   * @param {Number} txParams.amount                  (required) Amount coin (WEI)
   * @param {Number} txParams.nonce                   (optional) nonce
   * @param {Number} txParams.gasLimit                (optional) gasLimit
   * @param {Number} txParams.gasPrice                (optional) Fee that you want to pay for this transaction, if dont set you can use gasPriceType. gasPrice is priority than gasPriceType
   * @param {Number} txParams.gasPriceType            (optional) auto get fee transaction (low|medium|high). default medium
   * @param {String} txParams.sc.contractAddress      (optional) Adddress smart contract
   * @param {String} txParams.sc.nameFunc             (optional) name of function smart contract
   * @param {Array[String]} txParams.sc.typeParams    (optional) type of params function smart contract
   * @param {Array[Object]]} txParams.sc.paramsFuncs  (optional) value of params function smart contract
   * @returns {String}
   */
  async createRawTx(txParams) {

    if (!txParams.nonce) {
      let nonce = await this.getNonce();
      txParams.nonce = nonce.nonce;
    }
    if (!txParams.nonce || !txParams.amount || !txParams.to) {
      return '';
    }

    txParams.from = this.Account.address;
    txParams.privateKey = this.Account.privateKey;
    let transaction = new Transaction();

    if (!txParams.gasLimit) {
      txParams.gasLimit = Constant.DefaultGasLimit;
    }
    if (!txParams.gasPrice) {
      txParams.gasPrice = await this.getDefaultFee(txParams.gasPriceType);
    }

    transaction.to = txParams.to;
    transaction.gasLimit = txParams.gasLimit;
    transaction.gasPrice = txParams.gasPrice;
    transaction.nonce = txParams.nonce;
    transaction.value = txParams.amount;

    if (txParams.data) {
      transaction.data = txParams.data;
    } else if (txParams.sc &&
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

      transaction.sign(new Buffer(privateKey), 'hex');
      return '0x' + transaction.serialize().toString('hex');
    } catch (error) {
      console.log('error', error);
    }
    return '';
  }

  getDataSmartContract(nameFunction, typeParams, Params) {
    return Abi.methodID(nameFunction, typeParams).toString('hex') + Abi.rawEncode(typeParams, Params).toString('hex');
  }
}

module.exports = EthWallet;