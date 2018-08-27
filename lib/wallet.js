const Messages = require('./messages');
const Util = require('util');
const {
  AppError
} = require('node-infinito-util');
const InfinitApi = require('node-infinito-api');
const Account = require('./account');
const coinType = require('./support_coin');
const Bitcoinjs = require('bitcoinjs-lib');
const Helper = require('./helper');
const coinSelect = require('coinselect');

class Wallet {

  constructor(options) {
    this._check(options);
    if (!options.coinType) {
      options.coinType = coinType.BTC.symbol;
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
    return await this.infinitApi.getBalance(this.Account.address);
  }

  async getHistory(offset, limit) {
    return await this.infinitApi.getHistory(this.Account.address, offset, limit);
  }

  async getAddress() {
    return await this.infinitApi.getAddressInfo(this.Account.address);
  }

  async send(to, amount, feePerB, isBroadCast = true) {
    let listUnspent = await this.infinitApi.getUtxo(this.Account.Address);

    if (listUnspent.cd !== 0) {
      throw new AppError(listUnspent.message);
    }

    let rawTx = this.createRawTx(to, amount, listUnspent.data.transactions, feePerB);
    if (!rawTx.tx_hex) {
      return {
        error: 1,
        message: rawTx.error,
        isBroadCast
      }
    }

    if (isBroadCast) {
      let result = await this.infinitApi.sendTransaction({
        rawtx: rawTx.tx_hex
      });
      if (result.cd !== 0) {
        return {
          error: 1,
          message: result.message,
          isBroadCast
        }
      }
    }

    return {
      error: 0,
      isBroadCast,
      ...rawTx
    }
  }

  createRawTx(receiver, amount, listUnspent, feePerB) {
    amount = Helper.convertToSatoshi(amount);
    feePerB = feePerB ? feePerB : defaultFeePerB;
    let keyPair = Bitcoinjs.ECPair.fromPrivateKey(this.Account.privateKey);
    const transaction = new Bitcoinjs.TransactionBuilder(this.network);
    const targets = [{
      address: receiver,
      value: amount
    }];
    const inputTxs = [];
    for (let i = 0; i < listUnspent.length; i++) {
      const unspent = {
        value: parseFloat(listUnspent[i].amount),
        txid: listUnspent[i].tx_id,
        output_no: listUnspent[i].vout
      };
      inputTxs.push(unspent);
    }
    const {
      inputs,
      outputs,
      fee
    } = coinSelect(inputTxs, targets, feePerB);

    if (!inputs || !outputs) {
      return {
        tx_hex: '',
        fee,
        error: 'OVER_BALANCE'
      };
    }

    inputs.forEach(input => {
      transaction.addInput(input.txid, input.output_no);
    });

    outputs.forEach(output => {
      if (output.address && output.address.length > 0) {} else {
        output.address = this.Account.address;
      }
      transaction.addOutput(output.address, output.value);
    });

    for (let i = 0; i < inputs.length; i++) {
      transaction.sign(i, keyPair);
    }

    let tx = transaction.build();
    return {
      tx_hex: tx.toHex(),
      tx_id: tx.getId(),
      fee
    };
  }

  _check(options) {
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }
  }
}

module.exports = Wallet;