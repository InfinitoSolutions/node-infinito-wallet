const Neon = require('@cityofzion/neon-js');
const { Wallet, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./neo.tx_builder');
const Messages = require('./messages');

/**
 * Bitcoin wallet
 *
 * @class BtcWallet
 * @extends {Wallet}
 */
class NeoWallet extends Wallet {

  /**
   * Creates an instance of BtcWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @memberof NeoWallet
   */
  constructor(privateKey) {
    super(privateKey);
    this.__init();
  }

  /**
   * Init wallet from private key and network
   *
   * @param {Buffer} privateKey
   * @memberof NeoWallet
   */
  __init() {
    this.publicKey = Neon.wallet.getPublicKeyFromPrivateKey(this.privateKey);
    let script = Neon.wallet.getScriptHashFromPublicKey(this.publicKey);
    this.address = Neon.wallet.getAddressFromScriptHash(script);
    this.wif = Neon.wallet.getWIFFromPrivateKey(this.privateKey.toString('hex'));
    this.keyPair = { privateKey: this.privateKey, publicKey: Buffer.from(this.publicKey, 'hex') }
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
   * @memberof NeoWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof NeoWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof NeoWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    let tx = Neon.default.deserialize.tx(msg);
    let transaction = tx.sign(this.keyPair.privateKey.toString('hex'));
    let result = transaction.serialize(true)
    return {
      raw: result,
      tx_id: transaction.hash
    }
  }

}

module.exports = NeoWallet;