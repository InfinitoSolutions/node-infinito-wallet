const { WalletBuilder } = require('infinito-wallet-core');
const TomoWallet = require('./tomo.wallet');

/**
 * Blockchain 2.0 Wallet Builder Class
 * (Compatible with TOMO,ETC)
 *
 * @class WalletBuilder
 */
class TomoWalletBuilder extends WalletBuilder {

  constructor(platform = 'TOMO') {
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
    return new TomoWallet(keyInfo.privateKey, keyInfo.network);
  }

}

module.exports = TomoWalletBuilder;