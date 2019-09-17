const { AppError, TransactionBuilder } = require('infinito-wallet-core');
const Messages = require('./messages');
const Neon = require('@cityofzion/neon-js');

/**
 * @param  {String} assetId                 (required)  Asset Id
 */
async function getBalance(assetId) {
  let result = await this.coinApi.getBalance(this.account.address, assetId);
  return this._getReponse(result);
}

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
   * List utxo
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
    this.outputs.push(
      Neon.tx.createTransactionOutput(
        assetSymbol,
        value,
        address
      )
    );
    return this;
  }

  /**
   * Add many output
   *
   * @param {Array} repicients Array {assetSymbol, value, address}
   * @memberof NeoTxBuilder
   */
  sendToMany(repicients) {
    this.outputs.push(...repicients);
    return this;
  }

  /**
   * Get clamable input
   */
  async getClaimable() {
    let result = await this.api.getClaimable(this.wallet.address);
    return this._getReponse(result, Messages.server_error.code);
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
        return await this._createClaimTx();
      case 'CONTRACT':
        return await _createClaimTx();
    }
  }

  async __createContractTx(balance, assetSymbol, assetId, amount, toAddress) {
    let balance = new Neon.wallet.Balance();
    let outputs = [];
    let inputTxs = await this._getUnspendList(params.assetId);

    let balanceAsset = await this.getBalance(params.assetId);
    if (!balanceAsset) {
      return '';
    }
    params.balance = balanceAsset.assets[0].balance;

    let assetBalance = Neon.wallet.AssetBalance({
      balance: params.balance,
      unspent: inputTxs,
      spent: [],
      unconfirmed: []
    });
    balance.net = this.account.isTestNet ? 'TestNet' : 'MainNet';
    balance.address = this.account.address;
    balance.assetSymbols = [params.assetSymbol];
    balance.assets[params.assetSymbol] = assetBalance;
    let out = Neon.tx.createTransactionOutput(
      params.assetSymbol,
      params.amount,
      params.to
    );
    outputs.push(out);

    let tx = Neon.tx.default.create.contractTx(balance, outputs);
    let transaction = Neon.tx.signTransaction(
      tx,
      this.account.keyPair.privateKey.toString('hex')
    );
    let serialized = Neon.tx.serializeTransaction(transaction);
    return serialized;
  }

  /**
   * 
   * @param {Array} claimableList List claimable transaction [{unclaimed, tx_id, vout}]
   */
  async _createClaimTx(claimableList) {
    let inputTxs = [];
    if (!claimableList) {
      let claimableListData = await this.getClaimable();
      claimableList = claimableListData.transactions
    }

    if (claimableList.length == 0)
      throw new AppError(Messages.claimable_list_empty.message, Messages.claimable_list_empty.code);

    claimableList.forEach(element => {
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