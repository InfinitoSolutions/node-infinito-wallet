const Messages = require('./messages');
const AppError = require('./app_error');

class Wallet {

  /**
   * Creates an instance of Wallet.
   * @param {String/Buffer} privateKey Private key as hex string or buffer
   * @memberof Wallet
   */
  constructor(privateKey) {
    if (!privateKey) {
      throw AppError.create(Messages.missing_parameter, 'privateKey');
    }

    if (typeof(privateKey) === 'string') {
      this.privateKey = Buffer.from(privateKey, 'hex');
    } else if (Buffer.isBuffer(privateKey)) {
      this.privateKey = privateKey;
    } else {
      throw AppError.create(Messages.invalid_parameter, 'privateKey');
    }
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
    return this.privateKey;
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
   * Sign message
   *
   * @param {*} msg
   * @memberof Wallet
   */
  signMessage(msg) {
    throw new Error('Cannot call abstract method');
  }

  /**
   * Sign transaction
   *
   * @param {*} tx
   * @memberof Wallet
   */
  sign(tx) {
    throw new Error('Cannot call abstract method');
  }
}

module.exports = Wallet;