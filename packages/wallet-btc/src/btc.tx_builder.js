const coinSelect = require('coinselect');
const coinSelectUtils = require('coinselect/utils');
const Bitcoinjs = require('bitcoinjs-lib');
const { AppError, TransactionBuilder } = require('infinito-wallet-core');
const Messages = require('./messages');

/**
 * Get default feerate from api
 *
 * @param {*} api
 * @param {*} platform
 * @param {string} [feeType='medium']
 * @returns
 */
async function getDefaultFee(api, platform, feeType = 'medium') {
  let result = await api.getFeeRate();
  if (result.cd === 0) {
    return result.data[platform][feeType];
  }
  throw new AppError(result.msg, Messages.internal_error.code);
}

/**
 * Get list utxo of address
 *
 * @param {*} api
 * @param {*} address
 */
async function getUtxo(api, address) {
  let results = [];
  let utxoResult = await api.getUtxo(address);
  utxoResult.data.transactions.forEach(utxoItem => {
    results.push({
      value: parseFloat(utxoItem.amount),
      txid: utxoItem.tx_id,
      output_no: utxoItem.vout
    });
  });
  return results;
}

/**
 * Calculate value for send max
 *
 * @param {*} utxos
 * @param {*} outputs
 * @param {*} feeRate
 * @returns
 */
function coinSelectSendMax(utxos, outputs, feeRate) {
  if (!isFinite(coinSelectUtils.uintOrNaN(feeRate))) 
    return {};
  var sumInput = coinSelectUtils.sumOrNaN(utxos);
  outputs[0].value = sumInput;
  if (!outputs[0].address) {
    outputs[0].address = '0000000000000000000000000000000000';
  }
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

class BtcTxBuilder extends TransactionBuilder {
  constructor(platform = 'BTC') {
    super();

    this.platform = platform;
    this.outputs = [];
    this.useFeerateType('medium');
    this.withSign(true);
  }

  /**
   * Set feerate
   *
   * @param {Number} satoshiPerByte Feerate in satoshi per byte
   * @returns
   * @memberof BtcTxBuilder
   */
  useFeerate(satoshiPerByte) {
    this.feerate = satoshiPerByte;
    return this;
  }

  /**
   * Set feerate type. This setting will be used when feerate is not set.
   * There are 3 types (high, medium, low)
   *
   * @param {string} [type='medium']
   * @memberof BtcTxBuilder
   */
  useFeerateType(type = 'medium') {
    this.feerateType = type;
    return this;
  }

  /**
   * List utxo
   *
   * @param {Array} utxo Array of utxo object. {txid, value, output_no}
   * @memberof BtcTxBuilder
   */
  useUtxo(utxos) {
    this.utxos = utxos;
    return this;
  }

  /**
   * Set sign flag.
   *
   * @param {boolean} [sign=true]
   * @memberof BtcTxBuilder
   */
  withSign(sign = true) {
    this.sign = sign;
    return this;
  }

  /**
   * Add output
   *
   * @param {*} address Recipient address
   * @param {*} value Amount in satoshi
   * @memberof BtcTxBuilder
   */
  sendTo(address, value){
    this.outputs.push({
      address: address,
      value: value
    });
    return this;
  }

  /**
   * Add many output
   *
   * @param {Array} repicients Array {address, value}
   * @memberof BtcTxBuilder
   */
  sendToMany(repicients) {
    this.outputs.push(...repicients);
    return this;
  }

  /**
   * Send max to address. 
   * All addresses which are set in sendTo and sendToMany function will be ignore.
   *
   * @param {*} address
   * @memberof BtcTxBuilder
   */
  sendMaxTo(address) {
    this.outputMaxAddress = address;
    return this;
  }

  /**
   * Build transaction
   *
   * @returns
   * @memberof BtcTxBuilder
   */
  async build() {
    // Get feerate
    let feerate = this.feerate;
    if (feerate === null || feerate === undefined) {
      feerate = await getDefaultFee(this.api, this.platform, this.feerateType);
    }

    // Get utxo
    let utxos = this.utxos;
    let address = this.wallet.getAddress();
    // TODO: for test
    address = '1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL';
    if (utxos === null || utxos === undefined || utxos.length == 0) {
      utxos = await getUtxo(this.api, address);
    }

    // Output
    let outputs = [...this.outputs];

    // Create transaction
    let selectResult = {};
    if (this.outputMaxAddress !== null && this.outputMaxAddress !== undefined) {
      // Process send max to 1 address
      outputs = [{ address: this.outputMaxAddress}];
      selectResult = coinSelectSendMax(utxos, outputs, feerate);
    } else {
      selectResult = coinSelect(utxos, outputs, feerate); // {inputs, outputs, fee}
      if (!selectResult.inputs || !selectResult.outputs) {
        throw AppError.create(Messages.over_balance)
      }
    }

    const network = this.wallet.getNetwork();
    const transaction = new Bitcoinjs.TransactionBuilder(network);
    selectResult.inputs.forEach(input => {
      transaction.addInput(input.txid, input.output_no);
    });

    selectResult.outputs.forEach(output => {
      if (output.address !== null && output.address !== undefined && output.address.length > 0) {
        transaction.addOutput(output.address, output.value);
      } else {
        transaction.addOutput(address, output.value);
      }
    });

    // Sign
    if (this.sign === true) {
      // let keyPair = this.wallet.getKeyPair();
      // for (let i = 0; i < selectResult.inputs.length; i++) {
      //   transaction.sign(i, keyPair);
      // }
      return this.wallet.signTx(transaction);
    } 

    let tx = transaction.build();

    return {
      raw: tx.toHex(),
      tx_id: tx.getId()
    }
  }

  /**
   * Build transaction and broadcast to server.
   *
   * @returns
   * @memberof BtcTxBuilder
   */
  async buildAndBroadcast() {
    let buildResult = await this.build();
    return this.broadcast(buildResult.raw);
  }

  /**
   * Broadcast raw transaction
   *
   * @param {*} rawTx
   * @returns
   * @memberof BtcTxBuilder
   */
  async broadcast(rawTx) {
    let result = this.api.sendTransaction({
      rawtx: rawTx
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
}


module.exports = BtcTxBuilder;