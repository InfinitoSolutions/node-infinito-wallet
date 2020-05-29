const WalletETH = require('ethereumjs-wallet')
const Util = require('ethereumjs-util')
const { ec: EC } = require('elliptic')
const secp256k1 = new EC('secp256k1')
const { Wallet, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./eth.tx_builder');
const Messages = require('./messages');

/**
 * Eth wallet
 *
 * @class EthWallet
 * @extends {Wallet}
 */
class EthWallet extends Wallet {

  /**
   * Creates an instance of EthWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @memberof EthWallet
   */
  constructor(privateKey, network) {
    super(privateKey);
    this.network = network;
    this.__init();
  }

  /**
   * Init wallet from private key and network
   *
   * @param {Buffer} privateKey
   * @memberof EthWallet
   */
  __init() {
    if (!this.privateKey) {
      throw AppError.create(Messages.missing_parameter, 'privateKey');
    }
    const wallet = WalletETH.fromPrivateKey(this.privateKey);
    this.publicKey = wallet.getPublicKeyString().toString('hex');
    this.address = wallet.getAddressString();
    this.wif = this.privateKey;
    this.keyPair = { privateKey: this.privateKey, publicKey: this.publicKey };
  }

  /**
   * Get public key
   *
   * @returns
   * @memberof Wallet
   */
  getPublicKey() {
    return this.publicKey;
  }

  /**
   * Get address
   *
   * @returns
   * @memberof Wallet
   */
  getAddress() {
    return this.address;
  }

  /**
   * Get address
   *
   * @returns
   * @memberof Wallet
   */
  getWif() {
    return this.wif;
  }

  /**
   * Get keypair
   *
   * @returns
   * @memberof EthWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof EthWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof EthWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    const hasedMessage = EthereumFunction.hashMessage(message)
    const keyPair = secp256k1.keyFromPrivate(privateKey)
    const signature = keyPair.sign(EthereumFunction.arrayify(hasedMessage), { canonical: true })

    return {
      raw: (EthereumFunction.hexZeroPad(`0x${signature.r.toString(16)}`, 32) + EthereumFunction.hexZeroPad(`0x${signature.s.toString(16)}`, 32).substring(2) + (signature.recoveryParam ? '1c' : '1b')),
      tx_id: signature
    }
  }

}

module.exports = EthWallet;