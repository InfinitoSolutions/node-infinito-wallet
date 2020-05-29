const { WalletBuilder } = require('infinito-wallet-core');
const FioWallet = require('./fio.wallet');

/**
 * Blockchain 2.0 Wallet Builder Class
 * (Compatible with FIO,ETC)
 *
 * @class WalletBuilder
 */
class FioWalletBuilder extends WalletBuilder {

  constructor(platform = 'FIO') {
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
    return new FioWallet(keyInfo.privateKey, keyInfo.network);
  }

}

module.exports = FioWalletBuilder;