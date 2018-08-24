const Wallet = require('../lib/wallet');
const ConfigTest = require('./config.test');
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
    coinType: CoinType.BTC.symbol,
    isTestNet: true,
    privateKey: 'cShv8GgcNi3x8Jzs8NcpLqZravwCkzg2NhSWiKnP1zFFfb48uvHU'
  });

  // console.log('wallet[BTC]: ' + JSON.stringify(wallet.Accounts[CoinType.BTC.symbol]));
  // let result = await wallet.Accounts[CoinType.BTC.symbol].getBalance();
  // console.log('result getBalance BTC: ' + JSON.stringify(result));
  let result = await wallet.Accounts[CoinType.BTC.symbol].send('mt2EqmgkCKdwuM1N6N9PdsdPWBwCAh4YSE', 0.02);
  console.log('result send BTC: ' + JSON.stringify(result));
}

test();