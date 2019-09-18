const { AppError, TransactionBuilder } = require('infinito-wallet-core');
const Messages = require('./messages');
const Neon = require('@cityofzion/neon-js');

class NeoTxBuilder extends TransactionBuilder {
  constructor(platform = 'NEO') {
    super();

    this.platform = platform;
    this.outputs = [];
    this.withSign(true);
    this.type = 'CONTRACT'
  }

  /**
   * List utxo
   *
   * @param {Array} utxo Array of utxo object. {txid, value, output_no}
   * @memberof NeoTxBuilder
   */
  useUtxo(utxos) {
    this.utxos = utxos;
    return this;
  }

  /**
   * Type of transaction
   *
   * @param {String} type CONTRACT | CLAIM | TRANSFER
   * @memberof NeoTxBuilder
   */
  useType(type) {
    this.type = type;
    return this;
  }

  /**
   * Set sign flag.
   *
   * @param {boolean} [sign=true]
   * @memberof NeoTxBuilder
   */
  withSign(sign = true) {
    this.sign = sign;
    return this;
  }

  /**
   * Add output
   *
   * @param {String} assetSymbol NEO | GAS 
   * @param {*} value Amount in smallest unit
   * @param {String} address Recipient address
   * @memberof NeoTxBuilder
   */
  sendTo(assetSymbol, value, address) {
    let output = Neon.tx.TransactionOutput.fromIntent(assetSymbol, value, address);
    this.outputs.push(output);
    return this;
  }

  /**
   * Add many output
   *
   * @param {Array} repicients Array {assetSymbol, value, address}
   * @memberof NeoTxBuilder
   */
  sendToMany(repicients) {
    repicients.forEach(element => {
      let output = Neon.tx.TransactionOutput.fromIntent(element.assetSymbol, element.value, element.address);
      this.outputs.push(output);
    })
    return this;
  }

  /**
   * Get clamable input
   */
  async getClaimable() {
    let result = await this.api.getClaimable(this.wallet.address);
    return this.__getReponse(result, Messages.server_error.code);
  }

  /**
   * List of claimable transaction
   *
   * @param {Array} list List claimable transaction [{unclaimed, tx_id, vout}]
   * @memberof NeoTxBuilder
   */
  useClaimableList(list) {
    this.claimableList = list;
    return this;
  }

  /**
   * Build transaction
   *
   * @returns
   * @memberof NeoTxBuilder
   */
  async build() {
    switch (this.type) {
      case 'CLAIM':
        return await this.__createClaimTx();
      case 'CONTRACT':
        return await this.__createContractTx();
    }
  }

  async getClaimable() {
    let result = await this.api.getClaimable(this.wallet.address);
    return this.__getReponse(result, Messages.server_error.code);
  }

  async __createContractTx() {
    let balance = new Neon.wallet.Balance();
    balance.address = this.wallet.address;
    let assetIdSet = new Set();
    this.outputs.forEach(element => {
      assetIdSet.add(element.assetId)
    })

    assetIdSet.forEach(value => {
      // get balance
      let balanceAsset = await this.__getBalance(value)
      let utxos = await this.__getUTXOs(value);
      if (utxos.length == 0) {
        throw new AppError(Messages.utxos_empty.message, Messages.utxos_empty.code)
      }
      let assetBalance = Neon.wallet.AssetBalance({
        balance: balanceAsset.assets[0].balance,
        unspent: utxos,
        spent: [],
        unconfirmed: []
      });
      if (value == Neon.CONST.ASSET_ID.NEO)
        balance.addAsset('NEO', assetBalance);
      else if (value == Neon.CONST.ASSET_ID.GAS)
        balance.addAsset('GAS', assetBalance)
      else
        balance.addAsset(value, assetBalance)
    })

    let tx = Neon.default.create.contractTx()
    tx.addOutput(this.outputs)
    tx.calculate(balance)
    return tx.serialize()
  }

  /**
   * get balance base on asset Id
   * 
   * @param  {String} assetId                 (required)  Asset Id
   */
  async __getBalance(assetId) {
    let result = await this.api.getBalance(this.account.address, assetId);
    return this.__getReponse(result);
  }

  /**
   * get UTXOs base on asset Id
   * 
   * @param {*} assetId 
   */
  async __getUTXOs(assetId) {
    let inputTxs = [];
    let result = await this.coinApi.getUtxo(this.account.address, assetId);
    let data = this.__getReponse(result);
    let listUnspent = data.transactions;

    for (let i = 0; i < listUnspent.length; i++) {
      let unspent = {
        value: listUnspent[i].amount,
        txid: listUnspent[i].tx_id.slice(0, 2) === '0x' ? listUnspent[i].tx_id.slice(2) : listUnspent[i].tx_id,
        index: listUnspent[i].vout
      };
      inputTxs.push(Neon.wallet.Coin(unspent));
    }

    return inputTxs;
  }

  /**
   * Create claim transaction
   */
  async __createClaimTx() {
    let inputTxs = [];
    if (!this.claimableList) {
      let claimableListData = await this.getClaimable();
      this.claimableList = claimableListData.transactions
    }

    if (claimableList.length == 0)
      throw new AppError(Messages.claimable_list_empty.message, Messages.claimable_list_empty.code);

    this.claimableList.forEach(element => {
      inputTxs.push({
        claim: element.unclaimed,
        txid: element.tx_id.slice(0, 2) === '0x' ? element.tx_id.slice(2) : element.tx_id,
        index: element.vout
      });
    });
    var claimData = {
      claims: inputTxs
    };
    let tx = Neon.tx.default.create.claimTx(this.wallet.address, claimData);
    let result = Neon.tx.serializeTransaction(tx);
    return result;
  }
}

module.exports = NeoTxBuilder;