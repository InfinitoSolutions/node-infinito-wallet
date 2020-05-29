const TronWeb = require("tronweb");
const { Wallet, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./trx.tx_builder');
const Messages = require('./messages');

/**
 * Trx wallet
 *
 * @class TrxWallet
 * @extends {Wallet}
 */
class TrxWallet extends Wallet {

  /**
   * Creates an instance of TrxWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @memberof TrxWallet
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
   * @memberof TrxWallet
   */
  __init() {
    if (!this.privateKey) {
      throw AppError.create(Messages.missing_parameter, 'privateKey');
    }

    this.address = TronWeb.address.fromPrivateKey(this.privateKey.toString("hex"));
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
   * @memberof TrxWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof TrxWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof TrxWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    return msg;
  }

}

module.exports = TrxWallet;