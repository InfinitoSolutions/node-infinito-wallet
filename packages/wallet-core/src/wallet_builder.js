const Keygen = require('./keygen');
const Networks = require('./networks');

/**
 * Wallet Builder Class
 *
 * @class WalletBuilder
 */
class WalletBuilder {

  /**
   * Creates an instance of WalletBuilder.
   * @memberof WalletBuilder
   */
  constructor() {
    // this.isTestnet = false;
    this.useTestnet(false);
  }

  /**
   * Set config
   *
   * @param {*} [options={}]
   * @returns
   * @memberof WalletBuilder
   */
  withConfig(options = {}) {
    return this
      .withPlatform(options.platform)
      .withPrivateKey(options.privateKey || null)
      .withWif(options.wif || null)
      .useTestnet(options.testnet || false)
      .withMnemonic(options.mnemonic, options.password)
      .withHDPath(options.hdPath);
  }

  /**
   * Set platform. 
   *
   * @param {*} platform
   * @returns
   * @memberof WalletBuilder
   */
  withPlatform(platform) {
    if (typeof (platform) === 'string' && platform !== null && platform !== undefined) {
      platform = platform.toUpperCase();
    }
    this.platform = platform;
    return this;
  }

  /**
   * Enable/Disable testnet
   *
   * @param {boolean} [isTestnet=true]
   * @returns
   * @memberof WalletBuilder
   */
  useTestnet(isTestnet = true) {
    this.isTestnet = isTestnet;
    return this;
  }

  /**
   * Set private key
   *
   * @param {*} privateKey
   * @returns
   * @memberof WalletBuilder
   */
  withPrivateKey(privateKey) {
    this.privateKey = privateKey;
    return this;
  }

  /**
   * Set wif
   *
   * @param {*} wif
   * @memberof WalletBuilder
   */
  withWif(wif) {
    this.wif = wif;
    return this;
  }

  /**
   * Set mnemonic
   *
   * @param {*} mnemonic
   * @param {*} [password=null]
   * @returns
   * @memberof WalletBuilder
   */
  withMnemonic(mnemonic, password = null) {
    this.mnemonic = mnemonic;
    this.password = password;
    return this;
  }

  /**
   * Set HDPath
   *
   * @param {*} hdPath
   * @returns
   * @memberof WalletBuilder
   */
  withHDPath(hdPath) {
    this.hdPath = hdPath;
    return this;
  }

  /**
   * Create key from configuration.
   *
   * @returns
   * @memberof WalletBuilder
   */
  async createKey() {
    let privateKey = this.privateKey;
    let network = Networks.getNetwork(this.platform, this.isTestnet);

    // if (platform === null || privateKey === platform) {
    //   throw AppError.create(Messages.missing_parameter, 'privateKey');
    // }

    if (privateKey === null || privateKey === undefined) {
      let keypair = await Keygen.createKeypair(this.platform, this.mnemonic, this.password, this.hdPath, this.isTestnet);
      privateKey = keypair.privateKey;
    }

    return {
      privateKey,
      network
    };
  }

  /**
   * Build wallet by provided private key | wif or generated private key
   *
   * @returns
   * @memberof WalletBuilder
   */
  async build() {
    throw new Error('Cannot call abstract method');
  }
}

module.exports = WalletBuilder;