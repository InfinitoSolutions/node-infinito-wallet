const WalletEth = require('../lib/wallet_eth');
const ConfigTest = require('./config.test');
const CoinType = require('../lib/support_coin');
const InfinitApi = require('node-infinito-api');

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
  coinType: CoinType.ETH.symbol,
  isTestNet: false
};

async function test() {
  let api = new InfinitApi(opts);
  let wallet = new WalletEth(opts);
  wallet.setApi(api);


  // let result = await wallet.getAddress();
  // console.log('result getAddress ETH: ' + JSON.stringify(result));

  let result = await wallet.getNonce();
  console.log('result getNonce ETH: ' + JSON.stringify(result));
  // let result = await wallet.Accounts[CoinType.BTC.symbol].send('mt2EqmgkCKdwuM1N6N9PdsdPWBwCAh4YSE', 0.02);
  // console.log('result send BTC: ' + JSON.stringify(result));
}

test();