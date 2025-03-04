const Messages = require('./messages');
const { AppError } = require('node-infinito-util');
const BtcWallet = require('./wallet_btc');
const CoinType = require('./coin_type');
const Transaction = require('ethereumjs-tx');
const Abi = require('ethereumjs-abi');
const Constant = require('./constant');

class EthWallet extends BtcWallet {
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

  /**
   * Get nonce
   * @returns {Number}
   */
  async getNonce() {
    let result = await this.coinApi.getNonce(this.account.address);
    return this._getReponse(result).nonce;
  }

  /**
   * @returns {Number}
   */
  async getTxCount() {
    let result = await this.coinApi.getTxCount(this.account.address);
    return this._getReponse(result).tx_count;
  }

  /**
   * @param  {Number} offset
   * @param  {Number} limit
   * @returns {Object} { total: 0, from: 0, to: -1, transactions: [] }
   */
  async getTxAddress(offset, limit) {
    let result = await this.coinApi.getTxAddress(
      this.account.address,
      offset,
      limit
    );
    return this._getReponse(result);
  }

  /**
   * @param  {Number} offset
   * @param  {Number} limit
   * @returns {Object} { total: 0, from: 0, to: -1, transactions: [] }
   */
  async getInternalTxAddress(offset, limit) {
    let result = await this.coinApi.getInternalTxAddress(
      this.account.address,
      offset,
      limit
    );
    return this._getReponse(result);
  }

  /**
   * @param  {String} scAddress              (required)  Address Smartcontract
   * @returns {Object} { address: '', name: 'IP', symbol: 'IP', decimals: 10, total_supply: '1000 }
   */
  async getSmartContractInfo(scAddress) {
    let result = await this.coinApi.getSmartContractInfo(scAddress);
    return this._getReponse(result);
  }

  /**
   * @param  {String} scAddress              (required)  Address Smartcontract
   * @param  {Number} offset
   * @param  {Number} limit
   * @returns {Object}  { total: 0, from: 0, to: -1, transactions: [] }
   */
  async getContractHistory(scAddress, offset, limit) {
    let result = await this.coinApi.getContractHistory(
      scAddress,
      offset,
      limit,
      this.account.address
    );
    return this._getReponse(result);
  }

  /**
   * @param  {String} scAddress               (required)  Address Smartcontract
   * @returns {Number}
   */
  async getContractBalance(scAddress) {
    let result = await this.coinApi.getContractBalance(
      scAddress,
      this.account.address
    );
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

  async send({ rawTx, txParams, isBroadCast = true }) {
    let rawTxData = rawTx;
    if (!rawTxData) {
      rawTxData = await this.createRawTx(txParams);
      if (!rawTxData) {
        throw new AppError(
          Messages.create_crawtx_fail.message,
          Messages.create_crawtx_fail.code
        );
      }
    }

    if (isBroadCast) {
      let result = await this.coinApi.sendTransaction({
        rawtx: rawTxData
      });
      if (result.cd === 0) {
        return Object.assign(result.data, {
          raw: rawTxData
        });
      } else {
        throw new AppError(
          result.msg,
          Messages.create_transaction_fail.code
        );
      }
    }

    return {
      raw: rawTxData
    };
  }

  /**
   * @param  {String} contractAddress       (required) Adddress smart contract
   * @param  {String} to                    (required) Adddress receiver
   * @param  {Number} amount                (required) Amount token/coin
   * @returns {Object}   {raw:'',tx_id:''}
   */
  async transfer(contractAddress, to, amount, opts) {
    let txParams = {};
    if (opts) {
      txParams = { txParams, ...opts };
    }
    txParams.sc = {};
    txParams.to = contractAddress;
    txParams.amount = amount;
    txParams.sc.contractAddress = contractAddress;
    txParams.sc.nameFunc = 'transfer';
    txParams.sc.typeParams = ['address', 'uint256'];
    txParams.sc.paramsFuncs = [to, amount];

    let rawTx = await this.createRawTx(txParams);
    return await this.send({
      rawTx: rawTx,
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
   * @param {String} txParams.data                    (optional) smart contract data
   * @param {String} txParams.sc.contractAddress      (optional) Adddress smart contract
   * @param {String} txParams.sc.nameFunc             (optional) name of function smart contract
   * @param {Array[String]} txParams.sc.typeParams    (optional) type of params function smart contract
   * @param {Array[Object]]} txParams.sc.paramsFuncs  (optional) value of params function smart contract
   * @returns {String}
   */
  async createRawTx(txParams) {
    if (!txParams.nonce) {
      txParams.nonce = await this.getNonce();
    }
    if (!txParams.nonce || (!txParams.sc && !txParams.data && (!txParams.amount || !txParams.to))) {
      return '';
    }

    txParams.from = this.account.address;
    txParams.privateKey = this.account.privateKey;
    let transaction = new Transaction();

    if (!txParams.gasLimit) {
      txParams.gasLimit = Constant.ETH.DefaultGasLimit;
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
    } else if (
      txParams.sc &&
      txParams.sc.nameFunc &&
      txParams.sc.typeParams &&
      txParams.sc.paramsFuncs
    ) {
      let data = getDataSmartContract(
        txParams.sc.nameFunc,
        txParams.sc.typeParams,
        txParams.sc.paramsFuncs
      );
      transaction.data = '0x' + data;
      transaction.to = txParams.sc.contractAddress;
      transaction.value = 0;
    }

    try {
      let privateKey =
        this.account.privateKey.indexOf('0x') === 0
          ? new Buffer(this.account.privateKey.substr(2), 'hex')
          : new Buffer(this.account.privateKey, 'hex');

      transaction.sign(new Buffer(privateKey), 'hex');
      return '0x' + transaction.serialize().toString('hex');
    } catch (err) {
      return '';
    }
  }
}

function getDataSmartContract(nameFunction, typeParams, Params) {
  return (
    Abi.methodID(nameFunction, typeParams).toString('hex') +
    Abi.rawEncode(typeParams, Params).toString('hex')
  );
}

module.exports = EthWallet;
