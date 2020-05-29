const { WalletBuilder } = require('infinito-wallet-core');
const TrxWallet = require('./trx.wallet');

/**
 * Blockchain 2.0 Wallet Builder Class
 * (Compatible with TRX,ETC)
 *
 * @class WalletBuilder
 */
class TrxWalletBuilder extends WalletBuilder {

  constructor(platform = 'TRX') {
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
    return new TrxWallet(keyInfo.privateKey, keyInfo.network);
  }

}

module.exports = TrxWalletBuilder;