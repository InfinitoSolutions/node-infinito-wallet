const Wallet = require('../lib/wallet');
const ConfigTest = require('./config.test');
const Account = require('../lib/account');
const CoinType = require('../lib/support_coin');

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL
};

async function test() {

  let wallet = new Wallet(opts);
  wallet.createAccount({
    coinType: CoinType.Bitcoin,
    isTestNet: true
  });

  wallet.createAccount({
    coinType: CoinType.Bitcoin_Cash,
    isTestNet: true
  });

  console.log('wallet[BTC]: ' + JSON.stringify(wallet.Accounts[CoinType.Bitcoin]));
  console.log('wallet[BCH]: ' + JSON.stringify(wallet.Accounts[CoinType.Bitcoin_Cash]));
  let result = await wallet.Accounts[CoinType.Bitcoin].getBalance();
  console.log('result getBalance BTC: ' + JSON.stringify(result));
}

test();