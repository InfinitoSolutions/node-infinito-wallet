const { WalletBuilder } = require('infinito-wallet-core');
const AdaWallet = require('./ada.wallet');

/**
 * Blockchain 2.0 Wallet Builder Class
 * (Compatible with ADA,ETC)
 *
 * @class WalletBuilder
 */
class AdaWalletBuilder extends WalletBuilder {

  constructor(platform = 'ADA') {
    super();
    this.withPlatform(platform);
  }

  /**
   * Build wallet by provided private key | wif or generated private key
   *
   * @returns
   * @memberof WalletBuilder
   */
  async build() {
    let keyInfo = await this.createKey();
    return new AdaWallet(keyInfo.privateKey, keyInfo.network, this.mnemonic);
  }

}

module.exports = AdaWalletBuilder;