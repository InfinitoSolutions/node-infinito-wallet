const Wallet = require('../lib/wallet');
const ConfigTest = require('./config.test');
const CoinType = require('../lib/support_coin');
const InfinitApi = require('node-infinito-api');

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
  coinType: CoinType.BTC.symbol,
  isTestNet: true
};

async function test() {
  let api = new InfinitApi(opts);
  let wallet = new Wallet(opts);
  wallet.setApi(api);



  let result = await wallet.getBalance();
  console.log('result getBalance ETH: ' + JSON.stringify(result));
  // let result = await wallet.Accounts[CoinType.BTC.symbol].send('mt2EqmgkCKdwuM1N6N9PdsdPWBwCAh4YSE', 0.02);
  // console.log('result send BTC: ' + JSON.stringify(result));
}

test();