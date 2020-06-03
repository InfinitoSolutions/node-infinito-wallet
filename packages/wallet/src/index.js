const {BtcWalletBuilder} = require('infinito-wallet-btc');
// const {NeoWalletBuilder} = require('infinito-wallet-neo');
// const {EthWalletBuilder} = require('infinito-wallet-eth');
// const {OntWalletBuilder} = require('infinito-wallet-ont');
// const {AdaWalletBuilder} = require('infinito-wallet-ada');

const PLATFORM = {
  BTC: BtcWalletBuilder,
  // BCH: BtcWalletBuilder,
  // LTC: BtcWalletBuilder,
  // DOGE: BtcWalletBuilder,
  // DASH: BtcWalletBuilder,
  // NEO: NeoWalletBuilder,
  // ETH: EthWalletBuilder,
  // ETC: EthWalletBuilder,
  // EOS: BtcWalletBuilder,
  // ONT: OntWalletBuilder,
  // ADA: AdaWalletBuilder
}

/**
 * Blockchain 1.0 Wallet Builder Class
 * (Compatible with BTC,BCH,LTC,DOGE,DASH,NEO,ETH,ETC)
 *
 * @class WalletBuilder
 */
const WalletBuilder = (platform) => {
  return new PLATFORM[(platform || 'BTC').toUpperCase()]();
}

// module.exports = WalletBuilder;

window.WalletBuilder = WalletBuilder;
