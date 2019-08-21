const Blockchains = require('./blockchains');
const Keygen = require('./keygen');
const Networks = require('./networks');
// const BtcLib = require('../../wallet-btc/src');
// const BtcLib = require('infinito-btc');

/**
 * Wallet Builder Class
 *
 * @class WalletBuilder
 */
class WalletBuilder {

  constructor() {

  }

  withConfig(options = {}) {
    return this
      .withPlatform(options.platform)
      .withPrivateKey(options.privateKey)
      .withWif(options.wif)
      .withMnemonic(options.mnemonic, options.password)
      .withHDPath(options.hdPath);
  }

  withPlatform(platform) {
    if ( typeof(platform) == 'string' && platform !== null && platform !== undefined) {
      platform = platform.toUpperCase();
    }
    this.platform = platform;
    return this;
  }

  useTestnet(isTestnet = true) {
    this.isTestnet = isTestnet;
    return this;
  }

  withPrivateKey(privateKey) {
    this.privateKey = privateKey;
    return this;
  }

  withWif(wif) {
    this.wif = wif;
  }

  withMnemonic(mnemonic, password = null) {
    this.mnemonic = mnemonic;
    this.password = password;
    return this;
  }

  withHDPath(hdPath) {
    this.hdPath = hdPath;
    return this;
  }

  /**
   * Build wallet by provided private key | wif or generated private key
   *
   * @returns
   * @memberof WalletBuilder
   */
  // async build() {
  //   let privateKey = this.privateKey || this.wif;

  //   if (privateKey === null || privateKey === undefined) {
  //     let keypair = await Keygen.createKeypair(this.platform, this.mnemonic, this.password, this.hdPath, this.isTestnet);
  //     privateKey = keypair.privateKey;
  //   }

  //   let wallet = null;
  //   let network = Networks.getNetwork(this.platform, this.isTestnet);
  //   switch (this.platform) {
  //     case Blockchains.BTC:
  //       // wallet = new BtcLib.BtcWallet(privateKey, network);
  //       // wallet = __createWallet(privateKey, network);
  //       break;
  //     default:
  //       break;
  //   }

  //   return wallet;
  // }

  async createKey() {
    // let privateKey = this.privateKey || this.wif;
    let privateKey = this.privateKey;
    let network = Networks.getNetwork(this.platform, this.isTestnet);

    if (privateKey === null || privateKey === undefined) {
      if(this.wif == null || this.wif === undefined) {
        let keypair = await Keygen.createKeypair(this.platform, this.mnemonic, this.password, this.hdPath, this.isTestnet);
        privateKey = keypair.privateKey;
      } else {
        // TODO: convert wif to private key
      }
    }

    let wallet = null;
    
    // switch (this.platform) {
    //   case Blockchains.BTC:
    //     // wallet = new BtcLib.BtcWallet(privateKey, network);
    //     // wallet = __createWallet(privateKey, network);
    //     break;
    //   default:
    //     break;
    // }

    return {
      privateKey,
      network
    };
  }

  // __createWallet(privateKey, network) {
  //   throw new Error("Must be implement");
  // }
}

module.exports = WalletBuilder;