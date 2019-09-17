const { WalletBuilder } = require('infinito-wallet-core');
const NeoWallet = require('./neo.wallet');

/**
 * Blockchain 2.0 Wallet Builder Class
 *
 * @class WalletBuilder
 */
class NeoWalletBuilder extends WalletBuilder {

  constructor() {
    super();
    this.withPlatform('NEO');
  }

  /**
   * Build wallet by provided private key | wif or generated private key
   *
   * @returns
   * @memberof WalletBuilder
   */
  async build() {
    let keyInfo = await this.createKey();
    return new NeoWallet(keyInfo.privateKey, keyInfo.network);
  }

}

module.exports = NeoWalletBuilder;