const Messages = require('./messages');
const AppError = require('./app_error');
const Keygen = require('./keygen')

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
    throw new Error('Cannot call abstract method');
  }

  /**
   * Get address
   *
   * @returns
   * @memberof Wallet
   */
  getAddress() {
    throw new Error('Cannot call abstract method');
  }

  /**
   * Get keypair
   *
   * @returns
   * @memberof BtcWallet
   */
  getKeyPair() {
    throw new Error('Cannot call abstract method');
  };

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