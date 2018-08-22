const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const { AppError } = require('infinito-util');
const Util = require('util');
const coinType = require('../support_coin');
const Messages = require('../messages');
const Helper = require('../helper');
const coinSelect = require('coinselect');
const defaultFeePerB = 50;

class BitcoinAccount {
  /** 
   * options.mnemonic,
   * options.index,
   * options.hdPath,
   * options.privateKey,
   * options.coinType
   * options.isTestNet
   */
  constructor(options) {
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }

    if (coinType.Bitcoin != options.coinType) {
      throw new AppError(Messages.incorrect_cointype.message, Messages.incorrect_cointype.code);
    }

    if (options.privateKey) {
      this.privateKey = options.privateKey;
    }
    else {
      let keys = Keychain.getKeysFromPassPhrase({
        mnemonic: options.mnemonic,
        hdPath: options.hdPath,
        coinType: coinType.Bitcoin,
        index: options.index
      });
      this.privateKey = keys.privateKey;
    }

    this.options = options;
    let result = generateAccount(this.privateKey, options.isTestNet);
    Object.assign(this, result);
  }

  setInfinitApi(api) {
    this.infinitApi = api;
  }

  async getBalance() {
    return await this.infinitApi.getBalance(this.address);
  }

  async send(to, amount, feePerB, isSendMax) {
    let listUnspent = this.infinitApi.getUtxo(this.address);
    let rawTx = this._createRawTx(to, amount, listUnspent, feePerB);
    let result = this.infinitApi.send(rawTx);
  }

  async getHistory(offset, limit) {
    return await this.infinitApi.getHistory(this.address, offset, limit);
  }

  _createRawTx(receiver, amount, listUnspent, feePerB) {
    amount = Helper.convertToSatoshi(amount);
    feePerB = feePerB ? feePerB : defaultFeePerB;

    const transaction = new Bitcoinjs.TransactionBuilder(this.network);
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

    const { inputs, outputs, fee } = coinSelect(inputTxs, targets, feePerB);

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
      if (output.address && output.address.length > 0) {
      } else {
        output.address = sender;
      }
      transaction.addOutput(output.address, output.value);
    });

    for (let i = 0; i < inputs.length; i++) {
      transaction.sign(i, this.keyPair);
    }

    return {
      tx_hex: transaction.build().toHex(),
      fee
    };
  }
}

function generateAccount(privateKey, isTestNet = false) {
  let network = isTestNet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
  const { address } = Bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey })
  return {
    address,
    privateKey,
    publicKey: keyPair.publicKey.toString('hex'),
    network,
    isTestNet,
    keyPair: keyPair
  };
};

module.exports = BitcoinAccount;