const ecc = require('eosjs-ecc');
const { Wallet, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./fio.tx_builder');
const Messages = require('./messages');

/**
 * Fio wallet
 *
 * @class FioWallet
 * @extends {Wallet}
 */
class FioWallet extends Wallet {

  /**
   * Creates an instance of FioWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @memberof FioWallet
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
   * @memberof FioWallet
   */
  __init() {
    if (!this.privateKey) {
      throw AppError.create(Messages.missing_parameter, 'privateKey');
    }

    this.address = ecc.privateToPublic(this.privateKey, 'FIO');
    this.publicKey = this.address;
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
   * @memberof FioWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof FioWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof FioWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    return msg;
  }

}

module.exports = FioWallet;