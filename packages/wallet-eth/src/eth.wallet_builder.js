const { WalletBuilder } = require('infinito-wallet-core');
const EthWallet = require('./eth.wallet');

/**
 * Blockchain 2.0 Wallet Builder Class
 * (Compatible with ETH,ETC)
 *
 * @class WalletBuilder
 */
class EthWalletBuilder extends WalletBuilder {

  constructor(platform) {
    super();
    this.withPlatform(platform || 'ETH');
  }

  /**
   * Build wallet by provided private key | wif or generated private key
   *
   * @returns
   * @memberof WalletBuilder
   */
  async build() {
    let keyInfo = await this.createKey();
    return new EthWallet(keyInfo.privateKey, keyInfo.network);
  }

}

module.exports = EthWalletBuilder;