const { WalletBuilder } = require('infinito-wallet-core');
const LtcWallet = require('./ltc.wallet');

/**
 * Blockchain 1.0 Wallet Builder Class
 * (Compatible with BTC,BTC,LTC,DOGE,DASH)
 *
 * @class WalletBuilder
 */
class LtcWalletBuilder extends WalletBuilder {

  constructor(platform) {
    super();
    this.withPlatform(platform || 'LTC');
  }

  /**
   * Build wallet by provided private key | wif or generated private key
   *
   * @returns
   * @memberof WalletBuilder
   */
  async build() {
    let keyInfo = await this.createKey();
    return new LtcWallet(keyInfo.privateKey, keyInfo.network);
  }

}

module.exports = LtcWalletBuilder;