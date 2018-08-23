const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const { AppError } = require('infinito-util');
const Util = require('util');
const Messages = require('../messages');
const Helper = require('../helper');
const coinSelect = require('coinselect');
const CoinType = require('../support_coin');

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

    if (options.privateKey) {
      this.privateKey = options.privateKey;
    }
    else {
      let keys = Keychain.getKeysFromPassPhrase({
        mnemonic: options.mnemonic,
        hdPath: options.hdPath,
        coinType: options.coinType,
        index: options.index,
        isTestNet: options.isTestNet
      });
      this.privateKey = keys.privateKey;
    }

    this.coinType = options.coinType;
    let result = generateAccount(this.privateKey, options.isTestNet);
    Object.assign(this, result);
  }

  setInfinitApi(api) {
    this.infinitApi = api;
  }

  async getBalance() {
    return await this.infinitApi.getBalance(this.address);
  }

  async send(to, amount, feePerB, isBroadCast = true) {
    let listUnspent = await this.infinitApi.getUtxo(this.address);

    if (listUnspent.cd !== 0) {
      throw new AppError(listUnspent.message);
    }

    let rawTx = this._createRawTx(to, amount, listUnspent.data.transactions, feePerB);
    if (!rawTx.tx_hex) {
      return {
        error: 1,
        message: rawTx.error,
        isBroadCast
      }
    }

    if (isBroadCast) {
      let result = await this.infinitApi.send({
        rawtx: rawTx.tx_hex
      });
      console.log('rawTx.tx_hex:' + rawTx.tx_hex);
      console.log(result);
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
        value: parseFloat(listUnspent[i].amount),
        txid: listUnspent[i].tx_id,
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
        output.address = this.address;
      }
      transaction.addOutput(output.address, output.value);
    });

    for (let i = 0; i < inputs.length; i++) {
      transaction.sign(i, this.keyPair);
    }

    let tx = transaction.build();
    return {
      tx_hex: tx.toHex(),
      tx_id: tx.getId(),
      fee
    };
  }
}

function generateAccount(privateKey, isTestNet = false) {
  let network = isTestNet ? CoinType.BTC.network.testnet : CoinType.BTC.network.mainnet;
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
  const { address } = Bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: network })
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