const Wallet = require('./wallet');
const {
  Logger,
  AppError,
  Helper
} = require('node-infinito-util');
const Neon = require('@cityofzion/neon-js')

class WalletNeo extends Wallet {
  constructor(options) {
    if (!options.coinType) {
      options.coinType = coinType.ETH.symbol;
    }
    super(options);
  }

  async getBalance(asset_id) {
    return await this.infinitApi.getBalance(this.Account.address, asset_id);
  }

  async getUtxo(asset_id) {
    return await this.infinitApi.getUtxo(this.Account.address, asset_id);
  }

  async getClaimableGas() {
    return await this.infinitApi.getClaimableGas(this.Account.address);
  }

  async getUnclaimedGas() {
    return await this.infinitApi.getUnclaimedGas(this.Account.address);
  }

  async sendTransaction(tx_hex) {
    return await this.infinitApi.sendTransaction({
      rawtx: tx_hex
    });
  }

  async getContractInfo(sc_address) {
    return await this.infinitApi.getContractInfo(sc_address);
  }

  async getNEP5Balance(sc_address) {
    return await this.infinitApi.getNEP5Balance(sc_address, this.Account.address);
  }

  async getNEP5History(sc_address, offset, limit) {
    return await this.infinitApi.getNEP5History(sc_address, offset, limit);
  }

  createRawTx(params) {
    let balance = new Neon.wallet.Balance()
    let outputs = []
    const inputTxs = []
    for (let i = 0; i < params.listUnspent.length; i++) {
      let unspent = {}
      if (params.listUnspent[i].txid.slice(0, 2) === '0x') {
        unspent = {
          value: params.listUnspent[i].value,
          txid: params.listUnspent[i].txid.slice(2),
          index: params.listUnspent[i].index
        }
      } else {
        unspent = {
          value: params.listUnspent[i].value,
          txid: params.listUnspent[i].txid,
          index: params.listUnspent[i].index
        }
      }

      inputTxs.push(Neon.wallet.Coin(unspent))
    }
    let assetBalance = Neon.wallet.AssetBalance({
      balance: params.balance,
      unspent: inputTxs,
      spent: [],
      unconfirmed: []
    })
    balance.net = isTestNet ? 'TestNet' : 'MainNet'
    balance.address = params.from
    balance.assetSymbols = [params.type]
    balance.assets[params.type] = assetBalance
    let out = Neon.tx.createTransactionOutput(params.type, params.value, params.to)
    outputs.push(out)
    let tx = Neon.tx.default.create.contractTx(balance, outputs)
    let transaction = Neon.tx.signTransaction(tx, params.privateKey)
    let serialized = Neon.tx.serializeTransaction(transaction)

    return {
      tx_hex: serialized
    }
  }

  createInvocationTx({
    net,
    scriptHash,
    gasCost = '0',
    address,
    balanceNEO,
    balanceGAS,
    network, // NEO | GAS
    neoToMint = 0,
    gasToMint = 0,
    privateKey,
    neoListUnspend,
    gasListUnspend
  }) {
    const [isValid, message] = validateMintTokensInputs(
      neoToMint,
      gasToMint,
      scriptHash,
      balanceNEO,
      balanceGAS
    )

    if (!isValid) {
      return false
    }

    const _scriptHash =
      scriptHash.length === 40 ?
      scriptHash :
      scriptHash.slice(2, scriptHash.length)
    const scriptHashAddress = wallet.getAddressFromScriptHash(_scriptHash)
    const script = {
      scriptHash: _scriptHash,
      operation: 'mintTokens',
      args: []
    }

    let balance = new Neon.wallet.Balance({
      address,
      net
    })
    balance.addAsset('NEO', {
      balance: balanceNEO,
      unspent: neoListUnspend
    })
    balance.addAsset('GAS', {
      balance: balanceGAS,
      unspent: gasListUnspend
    })

    const intents = [
        ['NEO', neoToMint],
        ['GAS', gasToMint]
      ]
      .filter(([symbol, amount]) => amount > 0)
      .map(([symbol, amount]) =>
        api.makeIntent({
          [symbol]: amount
        }, scriptHashAddress)
      )

    // gas = 0
    let unsignedTx = Neon.tx.Transaction.createInvocationTx(balance, flatten(intents), script, 0, {})
    let signedTX = Neon.tx.signTransaction(unsignedTx, privateKey)
    let hxTx = Neon.tx.serializeTransaction(signedTX)

    return hxTx
  }

  createTransferTx({
    net,
    scriptHash,
    gasCost = '0',
    address,
    toAddress,
    balanceNEO,
    balanceGAS,
    network, // NEO | GAS
    transferAmount,
    privateKey,
    neoListUnspend,
    gasListUnspend
  }) {
    const preTransferAmount = parseFloat(new BigNumber(transferAmount).times(100000000));
    const _scriptHash =
      scriptHash.length === 40 ?
      scriptHash :
      scriptHash.slice(2, scriptHash.length)

    const fromAddrScriptHash = wallet.getScriptHashFromAddress(address)
    const toAddrScriptHash = Neon.u.reverseHex(wallet.getScriptHashFromAddress(toAddress))

    const invoke = {
      scriptHash: _scriptHash,
      operation: 'transfer',
      args: [Neon.u.reverseHex(fromAddrScriptHash), toAddrScriptHash, preTransferAmount]
    }

    let balances = new Neon.wallet.Balance({
      address,
      net
    })
    balances.addAsset('NEO', {
      balance: balanceNEO,
      unspent: neoListUnspend
    })
    balances.addAsset('GAS', {
      balance: balanceGAS,
      unspent: gasListUnspend
    })

    const intents = [{
      assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7', // GAS AssetId
      value: 0.00000001,
      scriptHash: fromAddrScriptHash
    }]
    // gas = 0
    let unsignedTx = Neon.tx.Transaction.createInvocationTx(balances, intents, invoke, 0, {
      version: 1
    })
    let signedTX = Neon.tx.signTransaction(unsignedTx, privateKey)
    let hxTx = Neon.tx.serializeTransaction(signedTX)

    return hxTx
  }

  scriptHashToNeoAddress(scriptHash) {
    if (scriptHash.slice(0, 2) !== '0x') {
      try {
        return wallet.getAddressFromScriptHash(scriptHash)
      } catch (e) {
        return ''
      }
    }
    try {
      return wallet.getAddressFromScriptHash(scriptHash.slice(2))
    } catch (e) {
      return ''
    }
  }

  createRawClaimGas(params) {
    const inputTxs = []
    for (let i = 0; i < params.listUnspent.length; i++) {
      let unspent = {}
      if (params.listUnspent[i].tx_id.slice(0, 2) === '0x') {
        unspent = {
          claim: params.listUnspent[i].unclaimed,
          txid: params.listUnspent[i].tx_id.slice(2),
          index: params.listUnspent[i].vout
        }
      } else {
        unspent = {
          claim: params.listUnspent[i].unclaimed,
          txid: params.listUnspent[i].tx_id,
          index: params.listUnspent[i].vout
        }
      }

      inputTxs.push(unspent)
    }
    var claimData = {
      claims: inputTxs
    }
    let tx = Neon.tx.default.create.claimTx(params.from, claimData);
    let transaction = Neon.tx.signTransaction(tx, params.privateKey);
    let serialized = Neon.tx.serializeTransaction(transaction);
    return serialized
  }
}

module.exports = WalletNeo;