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
  console.log(wallet);
  wallet.setApi(api);



  let result = await wallet.getBalance();
  console.log('result getBalance BTC: ' + JSON.stringify(result));
}

test();