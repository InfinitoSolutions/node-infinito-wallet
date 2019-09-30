const { WalletBuilder } = require('infinito-wallet-core');
const BtcWallet = require('./btc.wallet');

/**
 * Blockchain 1.0 Wallet Builder Class
 * (Compatible with BTC,BTC,LTC,DOGE,DASH)
 *
 * @class WalletBuilder
 */
class BtcWalletBuilder extends WalletBuilder {

  constructor(platform) {
    super();
    this.withPlatform(platform || 'BTC');
  }

  /**
   * Build wallet by provided private key | wif or generated private key
   *
   * @returns
   * @memberof WalletBuilder
   */
  async build() {
    let keyInfo = await this.createKey();
    return new BtcWallet(keyInfo.privateKey, keyInfo.network);
  }

}

module.exports = BtcWalletBuilder;