const Messages = require('./messages');
const Util = require('util');
const { AppError, Logger } = require('node-infinito-util');
const Bitcoinjs = require('bitcoinjs-lib');
const coinSelect = require('coinselect');
const coinSelectUtils = require('coinselect/utils');
const BtcWallet = require('./wallet_btc');
const CoinType = require('./coin_type');

class OmniWallet extends BtcWallet {
  constructor(options) {
    options.coinType = CoinType.OMNI.symbol;
    super(options);

    this.dustValue = 546; // official proposal
    this.precision = 1e8;
  }

  /**
   * Get balance wallet. Based on Coin will be return 'unconfirmed_balance'
   * @returns {Object} { balance: 0, unconfirmed_balance: 0 }
   */
  async getBalance(propertyId = 31) {
    let result = await this.coinApi.getBalance(this.account.address, propertyId);
    return this._getReponse(result);
  }

  /**
   * generate OmniLayer payload
   *
   * @param {number} amount transfer amount
   * @return {string} OmniLayer payload for tx output
   */
  genOmniPayload(amount) {
    const hexAmount = (amount * this.precision)
        .toString(16)
        .padStart(16, '0')
        .toUpperCase();
    const simpleSend = [
        '6f6d6e69', // omni
        // 31 for Tether, you can modify it depends on your regtest chain
        '000000000000001f',
        hexAmount,
    ].join('');
    const data = [Buffer.from(simpleSend, 'hex')];
    const omniOutput = Bitcoinjs.payments.embed({ data }).output;
    return omniOutput;
  }

  /**
   * send transaction using rawTx if you have rawTx already or pass txParams in order to build rawTx. rawTx is priority
   * @param  {String}  {rawTx                  (optional)  raw transaction
   * @param  {String}  txParams.to             (required)  Address receiver
   * @param  {Number}  txParams.amount         (required)  Amount coin send to receiver (santoshi)
   * @param  {Number}  txParams.fee            (optional)  Fee per block that you want to pay for this transaction, if dont set you can use feeType. fee is priority than feeType
   * @param  {Number}  txParams.feeType        (optional)  Auto get fee transaction (low|medium|high).  default is medium
   * @param  {Boolean} params.isSendMax              (optional)  Send all the money that you have in your address, if true then ignore amount
   * @param  {Boolean} isBroadCast=true }      (optional)  Send this transaction or just create raw
   * @returns {Object}  {raw:'',tx_id:''}
   */
  async send({ rawTx, txParams, isBroadCast = true }) {

    if ((rawTx === null || rawTx === undefined) &&
      (txParams === null || txParams === undefined)) {
      throw new AppError(
        Util.format(Messages.missing_parameter.message, 'rawTx or txParams'),
        Messages.missing_parameter.code
      );
    }

    let response = {
      raw: rawTx
    };
    if (!rawTx) {
      let rawTxData = await this.createRawTx(txParams);
      if (!rawTxData.raw) {
        throw new AppError(
          Messages.create_crawtx_fail.message,
          Messages.create_crawtx_fail.code
        );
      }
      response = rawTxData;
    }

    if (isBroadCast) {
      let result = await this.coinApi.sendTransaction({
        rawtx: response.raw
      });

      if (result.cd === 0 || result.cd === '0') {
        return {
          tx_id: result.data.txid,
          raw: response.raw
        };
      } else {
        throw new AppError(
          result.msg,
          Messages.send_transaction_fail.code
        );
      }
    }
    return response;
  }

  /**
   * @param  {Object}  params                        (required)  Address receiver
   * @param  {String}  params.to                     (required)  Address receiver
   * @param  {Number}  params.amount                 (required)  Amount coin send to receiver (santoshi)
   * @param  {Number}  params.fee                    (optional)  Fee per block that you want to pay for this transaction, if dont set you can use feeType. fee is priority than feeType
   * @param  {Number}  params.feeType                (optional)  Auto get fee transaction (low|medium|high). default medium
   * @param  {Boolean} params.isSendMaxBTC           (optional)  Send all the money that you have in your address, if true then ignore amount
   * @param  {Array[Object]}  params.listUnspent     (optional) List upspend
   * @returns {Object}  { raw: '',fee:100, error:''}
   */
  async createRawTx(params = {}) {

    // Check parameter
    if (params.to == null || params.to === undefined) {
      throw new AppError(
        Util.format(Messages.missing_parameter.message, 'to'),
        Messages.missing_parameter.code
      );
    }

    if ((params.fee == null || params.fee === undefined) &&
      (params.feeType == null || params.feeType === undefined)) {
      throw new AppError(
        Util.format(Messages.missing_parameter.message, 'fee or feeType'),
        Messages.missing_parameter.code
      );
    }

    if (params.feeType !== null && params.feeType !== undefined) {
      // low|medium|high
      if (!(params.feeType === 'low' || params.feeType === 'medium' || params.feeType === 'high')) {
        throw new AppError(
          Util.format(Messages.invalid_parameter.message, 'feeType'),
          Messages.invalid_parameter.code
        );
      }
    }

    if (params.fee !== null && params.fee !== undefined) {
      // low|medium|high
      if (!(params.fee > 0)) {
        throw new AppError(
          Util.format(Messages.invalid_parameter.message, 'fee'),
          Messages.invalid_parameter.code
        );
      }
    }

    let feePerB = params.fee;
    if (!params.fee) {
      let defaultFee = await this.getDefaultFee(params.feeType);
      feePerB = defaultFee;
    }

    const transaction = new Bitcoinjs.TransactionBuilder(this.account.network);

    const targets = [{
      address: params.to,
      value: this.dustValue
    }];

    // add OmniLayer payload output
    const omniPayload = this.genOmniPayload(params.amount);
    targets.push({
      address: omniPayload,
      value: 0
    });

    if (!params.listUnspent) {
      let listUnspent = await this.coinApi.getUtxo(this.account.address);

      if (listUnspent.cd !== 0) {
        throw new AppError(
          Messages.can_not_get_utxo.message,
          Messages.can_not_get_utxo.code
        );
      }

      if (listUnspent.data.transactions == null || listUnspent.data.transactions.length == 0) {
        return {
          raw: '',
          error: 'OVER_BALANCE'
        };
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

    const { inputs, outputs, fee } = params.isSendMaxBTC ? this._coinSelectSendMax(inputTxs, targets, feePerB) : coinSelect(inputTxs, targets, feePerB);
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
        output.address = this.account.address;
      }

      transaction.addOutput(output.address, output.value);
    });

    for (let i = 0; i < inputs.length; i++) {
      transaction.sign(i, this.account.keyPair);
    }

    let tx = transaction.build();
    return {
      raw: tx.toHex(),
      tx_id: tx.getId(),
      fee
    };
  }

  async getDefaultFee(feeType = 'medium') {
    let result = await this.coinApi.getFeeRate();
    if (result.cd === 0) {
      return result.data[this.account.coinType][feeType];
    }
    throw new AppError(result.msg, Messages.internal_error.code);
  }

  _check(options) {
    if (!options) {
      throw new AppError(
        Util.format(Messages.missing_parameter.message, 'options'),
        Messages.missing_parameter.code
      );
    }
  }

  _getReponse(response) {
    if (response.cd !== 0) {
      Logger.info(response);
      throw new AppError(JSON.stringify(response));
    }
    return response.data;
  }

  _coinSelectSendMax(utxos, outputs, feeRate) {
    if (!isFinite(coinSelectUtils.uintOrNaN(feeRate))) return {};
    var sumInput = coinSelectUtils.sumOrNaN(utxos);
    outputs[0].value = sumInput;
    var bytesAccum = coinSelectUtils.transactionBytes(utxos, outputs);
    var fee = feeRate * bytesAccum;
    var outputValue = sumInput - fee;
    outputs[0].value = outputValue;

    return {
      inputs: utxos,
      outputs: outputs,
      fee: fee
    };
  }
}

module.exports = OmniWallet;
