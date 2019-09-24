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

  useContract(contract) {
    this.smartcontract = contract;
    return this;
  }

  /**
   * transfer
   *
   * @param {String} assetSymbol NEO | GAS 
   * @param {*} value Amount in smallest unit
   * @param {String} address Recipient address
   * @memberof NeoTxBuilder
   */
  transferTo(to, amount, decimal = 8) {
    this.transferToAddress = to;
    this.transferAmount = amount;
    this.transferDecimal = decimal;
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
   * Balance of account
   * 
   * @param {*} balance  instance of Neon.wallet.Balance
   */
  useBalance(balance) {
    this.balance = balance;
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
      case 'TRANSFER':
        return await this.__createTransferTx();
      default:
        throw AppError.create(Messages.missing_parameter, 'type of transaction');
    }
  }

  async getClaimable() {
    let result = await this.api.getClaimable(this.wallet.address);
    return this.__getReponse(result, Messages.server_error.code);
  }

  async __createContractTx() {
    let tx = Neon.default.create.contractTx()

    if (!this.balance) {
      this.balance = new Neon.wallet.Balance();
      this.balance.address = this.wallet.address;
    }

    let assetIdSet = new Set();
    this.outputs.forEach(element => {
      assetIdSet.add(element.assetId)
      tx.addOutput(element)
    })

    if (!this.balance.assetSymbols.length) {
      for (let value of assetIdSet) {
        // get balance
        let balanceAsset = await this.__getBalance(value)
        let utxos = await this.__getUTXOs(value);
        if (utxos.length == 0) {
          throw new AppError(Messages.utxos_empty.message, Messages.utxos_empty.code)
        }
        let assetBalance = new Neon.wallet.AssetBalance({
          balance: balanceAsset.assets[0].balance,
          unspent: utxos,
          spent: [],
          unconfirmed: []
        });
        if (value == Neon.CONST.ASSET_ID.NEO)
          this.balance.addAsset('NEO', assetBalance);
        else if (value == Neon.CONST.ASSET_ID.GAS)
          this.balance.addAsset('GAS', assetBalance)
        else
          this.balance.addAsset(value, assetBalance)
      }
    }

    tx.calculate(this.balance)
    if (this.sign) {
      tx.sign(this.wallet.getPrivateKey().toString('hex'))
    }
    return tx.serialize(false)
  }

  /**
   * get balance base on asset Id
   * 
   * @param  {String} assetId                 (required)  Asset Id
   */
  async __getBalance(assetId) {
    let result = await this.api.getBalance(this.wallet.address, assetId);
    return this.__getReponse(result);
  }

  /**
   * get UTXOs base on asset Id
   * 
   * @param {*} assetId 
   */
  async __getUTXOs(assetId) {
    let inputTxs = [];
    let result = await this.api.getUtxo(this.wallet.address, assetId);
    let data = this.__getReponse(result);
    let listUnspent = data.transactions;

    for (let utxo of listUnspent) {
      let unspent = {
        value: utxo.amount,
        txid: utxo.tx_id.slice(0, 2) === '0x' ? utxo.tx_id.slice(2) : utxo.tx_id,
        index: utxo.vout
      };
      inputTxs.push(new Neon.wallet.Coin(unspent));
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

    if (this.claimableList.length == 0)
      throw new AppError(Messages.claimable_list_empty.message, Messages.claimable_list_empty.code);

    this.claimableList.forEach(element => {
      inputTxs.push({
        claim: element.unclaimed,
        txid: element.tx_id.slice(0, 2) === '0x' ? element.tx_id.slice(2) : element.tx_id,
        index: element.vout
      });
    });
    var claimData = {
      address: this.wallet.address,
      claims: inputTxs
    };
    let tx = Neon.default.create.claimTx();
    tx.addClaims(claimData);
    if (this.sign) {
      tx.sign(this.wallet.getPrivateKey().toString('hex'))
    }
    return tx.serialize(false);
  }


  async __createTransferTx() {
    if (!this.balance) {
      this.balance = new Neon.wallet.Balance();
      this.balance.address = this.wallet.address;
    }

    if (!this.balance.assetSymbols.length) {
      let balanceAsset = await this.__getBalance(Neon.CONST.ASSET_ID.GAS);
      let balanceGAS = balanceAsset.assets[0].balance;
      let gasListUnspend = await this.__getUTXOs(Neon.CONST.ASSET_ID.GAS);

      this.balance.addAsset('GAS', {
        balance: balanceGAS,
        unspent: gasListUnspend
      });
    }

    if (!this.smartcontract || this.smartcontract == '') {
      throw AppError.create(Messages.missing_parameter.message, 'smart contract address')
    }

    let scriptHash = this.smartcontract.length === 40 ? this.smartcontract : this.smartcontract.slice(2, this.smartcontract.length);
    const generator = Neon.nep5.abi.transfer(
      scriptHash,
      this.wallet.address,
      this.transferToAddress,
      new Neon.u.Fixed8(this.transferAmount).div(Math.pow(10, 8 - this.transferDecimal))
    );
    const builder = generator();
    const script = builder.str;

    const account = new Neon.wallet.Account(this.wallet.getPrivateKey().toString('hex'));
    const config = {
      account: account, // The sending Account
      intents: null, // Additional intents to move assets
      script: script, // The Smart Contract invocation script
      gas: 0, // Additional GAS for invocation.
      balance: this.balance
    };

    let result = await Neon.api.fillSigningFunction(config)
      .then(Neon.api.createInvocationTx)
      .then(Neon.api.addAttributeIfExecutingAsSmartContract)
      .then(Neon.api.addAttributeForMintToken)
      .then(Neon.api.modifyTransactionForEmptyTransaction)
      .then(Neon.api.addSignatureIfExecutingAsSmartContract)
      .then(Neon.api.addSignatureForMintToken)

    if (this.sign) {
      result.tx.sign(this.wallet.getPrivateKey().toString('hex'))
    }

    return result.tx.serialize();
  }
}

module.exports = NeoTxBuilder;