const ConfigTest = require('./config/config.test.staging.testnet');
const EthAccount = require('../lib/account/eth');
const CoinType = require('../lib/coin_type');

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL
};

async function test() {

  let account = new EthAccount({
    coinType: CoinType.ETH.symbol,
    isTestNet: true
  });
  console.log(account);
}

test();