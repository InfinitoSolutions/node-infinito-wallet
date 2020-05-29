const { AppError, TransactionBuilder, EthereumFunction } = require('infinito-wallet-core');
const Messages = require('./messages');
const Transaction = require('ethereumjs-tx')
const Abi = require('ethereumjs-abi')

class EthTxBuilder extends TransactionBuilder {
  constructor(platform = 'ETH') {
    super();

    this.platform = platform;
    this.outputs = [];
    this.GAS_LIMIT = 300000
    this.GAS_PRICE = 20000000000
  }

  /**
   * transfer
   *
   * @param {*} value Amount in smallest unit
   * @param {String} address Recipient address
   */
  transferTo(to, amount, decimal = 18) {
    this.transferToAddress = to;
    this.transferAmount = amount;
    this.transferDecimal = decimal;
    return this;
  }

  /**
   * get data smartcontract
   * 
   * @param {String} nameFunction
   * @param {*} typeParams
   * @param {Array} params
   */
  getDataSmartContract({ nameFunction, typeParams, params }) {
    return Abi
      .methodID(nameFunction, typeParams)
      .toString('hex') + Abi.rawEncode(typeParams, params)
        .toString('hex')
  }

  /**
   * create raw Tx
   * 
   * @param {*} txParams 
   */
  createRawTx(txParams) {
    if (txParams.privateKey === undefined ||
      txParams.privateKey === '' ||
      txParams.nonce === undefined ||
      txParams.value === undefined ||
      txParams.to === undefined) {
      return ''
    }
    const transaction = new Transaction()

    if (txParams.gasLimit === undefined) {
      txParams.gasLimit = this.GAS_LIMIT
    }
    if (txParams.gasPrice === undefined) {
      txParams.gasPrice = this.GAS_PRICE
    }

    transaction.to = txParams.to
    transaction.gasLimit = txParams.gasLimit * 1 // in wei
    transaction.gasPrice = txParams.gasPrice * 1 // in wei
    transaction.nonce = txParams.nonce * 1
    transaction.value = EthereumFunction.sanitizeHex(new BigNumber(txParams.value).toString(16)) // in wei

    if (txParams.nameFunc !== undefined &&
      txParams.nameFunc !== '' &&
      txParams.typeParams !== undefined &&
      txParams.paramsFuncs !== undefined
    ) {
      const data = this.getDataSmartContract(txParams.nameFunc, txParams.typeParams, txParams.paramsFuncs)
      transaction.data = '0x' + data
    }

    if (txParams.data !== undefined && txParams.data !== '') {
      transaction.data = txParams.data
    }

    try {
      let privateKey = txParams.privateKey
      privateKey = new Buffer(privateKey, 'hex')
      transaction.sign(new Buffer(privateKey), 'hex')
      return '0x' + transaction.serialize().toString('hex')
    } catch (error) {
      if (txParams.privateKey.indexOf('0x') === 0) {
        try {
          let privateKey = txParams.privateKey.substr(2)
          privateKey = new Buffer(privateKey, 'hex')
          transaction.sign(new Buffer(privateKey), 'hex')
          return '0x' + transaction.serialize().toString('hex')
        } catch (error) {
          return ''
        }
      }
    }
    return ''
  }

  /**
   * create raw smartcontract
   * 
   * @param {*} txParams
   */
  createRawSmartContractTx(txParams) {
    if (txParams.privateKey === undefined ||
      txParams.privateKey === '' ||
      txParams.nonce === undefined ||
      txParams.value === undefined ||
      txParams.to === undefined) {
      return ''
    }
    const transaction = new Transaction()

    if (txParams.gasLimit === undefined) {
      txParams.gasLimit = GAS_LIMIT
    }
    if (txParams.gasPrice === undefined) {
      txParams.gasPrice = GAS_PRICE
    }

    transaction.to = EthereumFunction.sanitizeHex(EthereumFunction.getNakedAddress(txParams.contractAddress))
    transaction.gasLimit = txParams.gasLimit * 1 // in wei
    transaction.gasPrice = txParams.gasPrice * 1 // in wei
    transaction.nonce = txParams.nonce * 1
    transaction.value = EthereumFunction.sanitizeHex('0') // default is 0

    let transferHex = '0x' + Abi.methodID('transfer', ['address', 'uint256']).toString('hex')
    let value = EthereumFunction.padLeft(new BigNumber(txParams.value).times(txParams.rate ? txParams.rate : 1).toString(16), 64)
    let toAddress = EthereumFunction.padLeft(EthereumFunction.getNakedAddress(txParams.to), 64) // send address
    let data = transferHex + toAddress + value
    transaction.data = EthereumFunction.sanitizeHex(data)

    try {
      let privateKey = txParams.privateKey
      privateKey = new Buffer(privateKey, 'hex')
      transaction.sign(new Buffer(privateKey), 'hex')
      return '0x' + transaction.serialize().toString('hex')
    } catch (error) {
      if (txParams.privateKey.indexOf('0x') === 0) {
        try {
          let privateKey = txParams.privateKey.substr(2)
          privateKey = new Buffer(privateKey, 'hex')
          transaction.sign(new Buffer(privateKey), 'hex')
          return '0x' + transaction.serialize().toString('hex')
        } catch (error) {
          return ''
        }
      }
    }
    return ''
  }

}

module.exports = EthTxBuilder;