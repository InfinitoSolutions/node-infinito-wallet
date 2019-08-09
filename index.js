module.exports = {
  Wallet: require('./lib/wallet'),
  BtcWallet: require('./lib/wallet_btc'),
  NeoWallet: require('./lib/wallet_neo'),
  EthWallet: require('./lib/wallet_eth'),
  BchWallet: require('./lib/wallet_bch'),
  OmniWallet: require('./lib/wallet_omni'),
  CoinType: require('./lib/coin_type'),
  InfinitoApi: require('node-infinito-api'),
  Account: require('./lib/account')
};