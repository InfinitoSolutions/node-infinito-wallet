console.log('server');
const Wallet = require('../lib/wallet');
const ConfigTest = require('./config.test');

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
  address: '1Dp1TZfsMDfrNwuAzXi8mJwcXNA5xiHPor',
  coin: 'BTC'
};

async function test() {
  let wallet = new Wallet(opts);
  let result = await wallet.getBalance();
  console.log('getBalance:' + JSON.stringify(result));

  result = await wallet.getHistory(1, 10);
  console.log('getHistory:' + JSON.stringify(result));
}

test();