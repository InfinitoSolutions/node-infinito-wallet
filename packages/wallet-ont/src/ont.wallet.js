const Ontio = require('ontology-ts-sdk');
const { Wallet, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./ont.tx_builder');
const Messages = require('./messages');

/**
 * Ont wallet
 *
 * @class OntWallet
 * @extends {Wallet}
 */
class OntWallet extends Wallet {

  /**
   * Creates an instance of OntWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @memberof OntWallet
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
   * @memberof OntWallet
   */
  __init() {
    if (!this.privateKey) {
      throw AppError.create(Messages.missing_parameter, 'privateKey');
    }
    this.privateKey = new Ontio.Crypto.PrivateKey(this.privateKey);
    this.publicKey = this.privateKey.getPublicKey();
    this.address = Ontio.Crypto.Address.fromPubKey(this.publicKey).toBase58();
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
   * @memberof OntWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof OntWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof OntWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    const encoded = Ontio.utils.str2hexstr(msg)
    const signature = this.privateKey.sign(encoded, Ontio.Crypto.SignatureScheme.ECDSAwithSHA256)
    return signature.serializeHex()
  }

}

module.exports = OntWallet;