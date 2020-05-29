const { WalletBuilder } = require('infinito-wallet-core');
const BnbWallet = require('./bnb.wallet');

/**
 * Blockchain 2.0 Wallet Builder Class
 * (Compatible with BNB,ETC)
 *
 * @class WalletBuilder
 */
class BnbWalletBuilder extends WalletBuilder {

  constructor(platform = 'BNB') {
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
    return new BnbWallet(keyInfo.privateKey, keyInfo.network, this.platform);
  }

}

module.exports = BnbWalletBuilder;