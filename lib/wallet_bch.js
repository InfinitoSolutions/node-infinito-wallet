const BtcWallet = require('./wallet_btc');
const CoinType = require('./coin_type');
const BtcoinCashjs = require('bitcoincashjs');
const Util = require('util');
const { AppError, Logger } = require('node-infinito-util');
const Messages = require('./messages');

class BchWallet extends BtcWallet {
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
    if (!options) {
      throw new AppError(
        Util.format(Messages.missing_parameter.message, 'options'),
        Messages.missing_parameter.code
      );
    }

    if (!options.coinType) {
      options.coinType = CoinType.BCH.symbol;
    }

    super(options);
  }

  /**
   * @param  {Object}  params                        (required)  Address receiver
   * @param  {String}  params.to                     (required)  Address receiver
   * @param  {Number}  params.amount                 (required)  Amount coin send to receiver (santoshi)
   * @param  {Number}  params.fee                    (optional)  Fee per block that you want to pay for this transaction, if dont set you can use feeType. fee is priority than feeType
   * @param  {Number}  params.feeType                (optional)  Auto get fee transaction (low|medium|high). default medium
   * @param  {Array[Object]}  params.listUnspent     (optional) List upspend
   * @returns {Object}  { raw: '',fee:100, error:''}
   */
  async createRawTx(params) {
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

    let inputTxs = [];
    for (let i = 0; i < params.listUnspent.length; i++) {
      const unspent = {
        satoshis: parseFloat(params.listUnspent[i].amount),
        txId: params.listUnspent[i].tx_id,
        outputIndex: params.listUnspent[i].vout,
        script: params.listUnspent[i].scriptpubkey
      };
      inputTxs.push(unspent);
    }

    let transaction = new BtcoinCashjs.Transaction()
      .from(inputTxs)
      .to(params.to, params.amount)
      .feePerKb(feePerB * 1024)
      .change(this.account.address)
      .sign(this.account.privateKey);

    return {
      raw: transaction.toString(),
      fee: transaction.getFee()
    };
  }
}

module.exports = BchWallet;
