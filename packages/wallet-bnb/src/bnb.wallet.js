const { crypto, utils, amino } = require("@binance-chain/javascript-sdk");
const BncClient = require("@binance-chain/javascript-sdk");
const { Wallet, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./bnb.tx_builder');
const Messages = require('./messages');

/**
 * Bnb wallet
 *
 * @class BnbWallet
 * @extends {Wallet}
 */
class BnbWallet extends Wallet {

  /**
   * Creates an instance of BnbWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @memberof BnbWallet
   */
  constructor(privateKey, network, platform) {
    super(privateKey);
    this.network = network;
    this.__init(platform);
  }

  /**
   * Get Prefix
   */
  getPrefix(platform) {
    return {
      BNB: 'bnb',
      IRIS: 'iaa',
      COSMOS: 'cosmos'
    }[platform];
  }

  /**
   * Init wallet from private key and network
   *
   * @param {Buffer} privateKey
   * @memberof BnbWallet
   */
  __init(platform) {
    if (!this.privateKey) {
      throw AppError.create(Messages.missing_parameter, 'privateKey');
    }

    this.address = crypto.getAddressFromPrivateKey(this.privateKey, this.getPrefix(platform));
    this.publicKey = crypto.getPublicKeyFromPrivateKey(this.privateKey);
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
   * @memberof BnbWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof BnbWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof BnbWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    const signBytes = amino.convertObjectToSignBytes(msg);
    const signBytesHex = utils.isHex(msg) ? msg : utils.ab2hexstring(signBytes)
    const signatureBuffer = crypto.generateSignature(signBytesHex, privateKey)
    const signatureHex = utils.ab2hexstring(signatureBuffer)
    return signatureHex
  }

}

module.exports = BnbWallet;