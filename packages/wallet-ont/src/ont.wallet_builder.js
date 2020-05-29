const { WalletBuilder } = require('infinito-wallet-core');
const OntWallet = require('./ont.wallet');

/**
 * Blockchain 2.0 Wallet Builder Class
 * (Compatible with ONT,ETC)
 *
 * @class WalletBuilder
 */
class OntWalletBuilder extends WalletBuilder {

  constructor(platform = 'ONT') {
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
    return new OntWallet(keyInfo.privateKey, keyInfo.network);
  }

}

module.exports = OntWalletBuilder;