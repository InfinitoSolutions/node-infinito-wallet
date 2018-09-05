module.exports = {
  Wallet: require('./lib/wallet'),
  NeoWallet: require('./lib/wallet_neo'),
  EthWallet: require('./lib/wallet_eth'),
  CoinType: require('./lib/coin_type'),
  InfinitApi: require('node-infinito-api'),
  Account: require('./lib/account')
};