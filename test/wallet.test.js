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
  isTestNet: true,
  privateKey: 'cVg2gYrsfHBf4iBWncrm86VHd1VqcUCFdJ9FJtLbdLfwvqc1eL6v'
};
//address: 'mssJexznaEypEfeLGf4v7J2WvKX6vFAjrs'

async function test() {
  let api = new InfinitApi(opts);
  let wallet = new Wallet(opts);
  wallet.setApi(api);



  let resultgetBalance = await wallet.getBalance();
  console.log('result getBalance BTC: ' + JSON.stringify(resultgetBalance));
  let result = await wallet.send({
    txParams: {
      to: 'mg5G1LAphJKvz2RM81A7HphHcZzS5sppaq',
      amount: 0.02
    },
    isBroadCast: true
  });
  console.log('result send BTC: ' + JSON.stringify(result));
}

test();