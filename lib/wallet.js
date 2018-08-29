const Messages = require('./messages');
const Util = require('util');
const {
  AppError,
  Logger
} = require('node-infinito-util');
const Account = require('./account');
const CoinType = require('./coin_type');
const Bitcoinjs = require('bitcoinjs-lib');
const Helper = require('./helper');
const coinSelect = require('coinselect');

class Wallet {

  constructor(options) {
    this._check(options);
    if (!options.coinType) {
      options.coinType = CoinType.BTC.symbol;
    }
    this.Account = new Account({
      mnemonic: options.mnemonic,
      hdPath: options.hdPath,
      privateKey: options.privateKey,
      coinType: options.coinType,
      index: options.index,
      isTestNet: options.isTestNet
    });

  }

  setApi(api) {
    this.api = api;
    this.infinitApi = this.api[this.Account.coinType];
  }

  getApi() {
    return this.api;
  }

  async getBalance() {

    let result = await this.infinitApi.getBalance(this.Account.address);
    return this._getReponse(result);
  }

  async getHistory(offset, limit) {
    let result = await this.infinitApi.getHistory(this.Account.address, offset, limit);
    return this._getReponse(result);
  }

  async getAddress() {
    let result = await this.infinitApi.getAddressInfo(this.Account.address);
    return this._getReponse(result);
  }

  /**
<<<<<<< HEAD
   * Send
   *
   * @example
   *  var txParams = { 
   *      to: "0xfd2921b8b8f0dccf65d4b0793c3a2e5c127f3e86",
   *      amount: 12, 
   *      feePerB: 300000
   *  };
   */
  async send({
    rawTx,
    txParams,
    isBroadCast = true
  }) {
    let response = {
      tx_hex: rawTx
    };
    if (!rawTx) {
      let listUnspent = await this.infinitApi.getUtxo(this.Account.address);
      if (listUnspent.cd !== 0) {
        return {
          tx_hex: ''
        };
      }

      let rawTxData = this.createRawTx(txParams.to, txParams.amount, listUnspent.data.transactions, txParams.feePerB);

      console.log('rawTxData', rawTxData);
      if (!rawTxData.tx_hex) {
        return {
          tx_hex: ''
        };
      }
      response = rawTxData;
    } else {
      response = {
        tx_hex: rawTx
      };
=======
* Send
*
* @example
*  var txParams = { 
*      to: "0xfd2921b8b8f0dccf65d4b0793c3a2e5c127f3e86",
*      amount: 12, 
*      feePerB: 300000
*  };
*/
  async send({ rawTx, txParams, isBroadCast = true }) {
    let response = { raw: rawTx };
    if (!rawTx) {
      let rawTxData = await this.createRawTx(txParams);
      console.log('rawTxData', rawTxData);
      if (!rawTxData.raw) {
        return { raw: '' };
      }
      response = rawTxData;
    }
    else {
      response = { raw: rawTx };
>>>>>>> develop
    }
    if (isBroadCast) {
      let result = await this.infinitApi.sendTransaction({
        rawtx: response.raw
      });
      console.log('rawTx:' + response);
      console.log(result);
      if (result.cd !== 0) {
        return {
          tx_id: result.data.tx_id,
          raw: result.data.tx_hex
        };
      }
    }
    return response;
  }
  //to, amount, listUnspent, fee,feeType
  async createRawTx(params) {
    // amount = Helper.convertToSatoshi(amount); 
    let defaultFee = await this.getDefaultFee(params.feeType);
    let feePerB = params.fee ? params.fee : defaultFee;
    const transaction = new Bitcoinjs.TransactionBuilder(this.Account.network);
    const targets = [{
      address: params.to,
      value: params.amount
    }];

    if (!params.listUnspent) {
      let listUnspent = await this.infinitApi.getUtxo(this.Account.address);
      if (listUnspent.cd !== 0) {
        return { raw: '', error: 'OVER_BALANCE' };
      }
      params.listUnspent = listUnspent.data.transactions;
    }

    const inputTxs = [];
    for (let i = 0; i < params.listUnspent.length; i++) {
      const unspent = {
        value: parseFloat(params.listUnspent[i].amount),
        txid: params.listUnspent[i].tx_id,
        output_no: params.listUnspent[i].vout
      };
      inputTxs.push(unspent);
    }

    console.log('inputTxs', inputTxs);

    const {
      inputs,
      outputs,
      fee
    } = coinSelect(inputTxs, targets, feePerB);

    if (!inputs || !outputs) {
      return {
        raw: '',
        fee,
        error: 'OVER_BALANCE'
      };
    }

    inputs.forEach(input => {
      transaction.addInput(input.txid, input.output_no);
    });

    outputs.forEach(output => {
      if (!(output.address && output.address.length > 0)) {
        output.address = this.Account.address;
      }
      transaction.addOutput(output.address, output.value);
    });

    for (let i = 0; i < inputs.length; i++) {
      transaction.sign(i, this.Account.keyPair);
    }

    let tx = transaction.build();
    return {
      raw: tx.toHex(),
      tx_id: tx.getId(),
      fee
    };
  }

  async getDefaultFee(feeType = 'medium') {
    let result = await this.infinitApi.getFeeRate();
    if (result.cd == 0) {
      return result.data[this.Account.coinType][feeType];
    }
    throw new AppError(result.msg, Messages.internal_error.code);
  }

  _check(options) {
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }
  }

  _getReponse(response) {
    console.log('response', response);
    if (response.cd !== 0) {
      Logger.info(response);
      throw new AppError(JSON.stringify(response));
    }
    return response.data;
  }
}

module.exports = Wallet;