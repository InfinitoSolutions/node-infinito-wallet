const Messages = require('./messages');
const AppError = require('./app_error');
const Keygen = require('./keygen');

class Wallet {

  /**
   * Creates an instance of Wallet.
   * @param {String/Buffer} privateKey Private key as hex string or buffer
   * @memberof Wallet
   */
  constructor(privateKey) {
    if (typeof (privateKey) === 'string') {
      if (privateKey.length == 64) {
        // Private key hex string
        this.privateKey = Buffer.from(privateKey, 'hex');
      } else {
        // Wif string
        this.privateKey = Keygen.wifToPrivateKey(privateKey);
      }
    } else if (Buffer.isBuffer(privateKey)) {
      // Private key with 32 bytes
      if (privateKey.length != 32) {
        throw AppError.create(Messages.invalid_parameter, 'privateKey');
      }
      this.privateKey = privateKey;
    }
    else {
      if (privateKey)
        throw AppError.create(Messages.invalid_parameter, 'privateKey');
    }

    this.publicKey = null;
    this.keyPair = null;
    this.address = null;
  }

  /**
   * Get private key
   *
   * @returns
   * @memberof Wallet
   */
  getPrivateKey() {
    return this.privateKey;
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
   * Get keypair
   *
   * @returns
   * @memberof Wallet
   */
  getKeyPair() {
    return this.keyPair;
  }

  /**
   * Sign transaction
   *
   * @param {*} tx
   * @memberof Wallet
   */
  signTx(tx) {
    throw new Error('Cannot call abstract method');
  }
}

module.exports = Wallet;