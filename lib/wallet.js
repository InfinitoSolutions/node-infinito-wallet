const Messages = require('./messages');
const Util = require('util');
const { TokenProvider, Logger, AppError, Helper } = require('infinito-util');
const InfinitApi = require('node-infinito-api');
const Account = require('./Account');

class Wallet {

  /**
   * passPhrase: {
   *   seed:'',
   *   index:0,
   *   hdPath:'m/44'/888'/0'/0'
   * } 
   * privateKey
   * isTestNet
   * apiKey
   * secret
   * baseUrl
   * version
   * logger
   * logLevel
   * coinType
   */
  constructor(options) {
    this._check(options);
    this.options = options;
    this.account = new Account({
      passPhrase: options.passPhrase,
      privateKey: options.privateKey,
      isTestNet: options.isTestNet
    });
    let api = new InfinitApi(this.options);
    this.infinitApi = api[this.options.coinType];
  }


  async getBalance() {
    return await this.infinitApi.getBalance(this.account.address);
  }

  send(to, amount) {
    let listUnspent = this.infinitApi.getUtxo(this.account.address);
    let rawTx = this._createRawTx();
  }

  async getHistory(offset, limit) {
    return await this.infinitApi.getHistory(this.account.address, offset, limit);
  }


  _createRawTx(receiver, amount, listUnspent) {
    console.log('ibl-core-wallet - params => ', params);
    amount = Bitcoin.convertToSatoshi(amount);
    const feePerB = params.feePerB ? params.feePerB : defaultFeePerB;
    const bitcoinNetwork = isTestNet ? bitcoinjs.networks.testnet : bitcoinjs.networks.bitcoin;
    const privateKey = params.privateKey;

    const transaction = new bitcoinjs.TransactionBuilder(bitcoinNetwork);
    const targets = [
      {
        address: receiver,
        value: amount
      }
    ];

    const inputTxs = [];
    for (let i = 0; i < listUnspent.length; i++) {
      const unspent = {
        value: parseFloat(listUnspent[i].value),
        txid: listUnspent[i].txid,
        output_no: listUnspent[i].vout
      };
      inputTxs.push(unspent);
    }

    console.log('ibl-core-wallet - list input => ', inputTxs, targets, feePerB);
    const { inputs, outputs, fee } = isSendMax ? sendMax(inputTxs, targets, feePerB) : coinSelect(inputTxs, targets, feePerB);
    console.log('ibl-core-wallet - result => ', inputs, outputs, fee);
    if (!inputs || !outputs) {
      return {
        tx_hex: '',
        fee,
        error: 'OVER_BALANCE'
      };
    }

    inputs.forEach(input => transaction.addInput(input.txid, input.output_no));

    outputs.forEach(output => {
      if (output.address && output.address.length > 0) {
      } else {
        output.address = sender;
      }
      transaction.addOutput(output.address, output.value);
    });

    for (let i = 0; i < inputs.length; i++) {
      transaction.sign(i, keyPair);
    }

    return {
      tx_hex: transaction.build().toHex(),
      fee,
    };
  }
  _check(params) {
    if (!params) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }
  }
}


let wallet = new Wallet();
wallet.Accounts.Add(btcaccount);
wallet.Accounts.Btc.send('', '');
wallet.Accounts.Btc.getBalance();


wallet.Accounts

module.exports = Wallet;