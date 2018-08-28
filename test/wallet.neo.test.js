// const WalletNeo = require('../lib/wallet_neo');
// const ConfigTest = require('./config/config.test.staging.testnet');
// const ConfigTestMainnet = require('./config/config.test.staging.mainnet');
// const CoinType = require('../lib/support_coin');
// const InfinitApi = require('node-infinito-api');

// const opts = {
//   apiKey: ConfigTest.API_KEY,
//   secret: ConfigTest.SECRECT,
//   baseUrl: ConfigTestMainnet.BASE_URL,
//   logLevel: ConfigTestMainnet.LOG_LEVEL,
//   privateKey: 'L4kmU3kT6rfT436C995aWo5oHxta4qB1JaRSr8EWqqEtV6NsSYnm',
//   coinType: CoinType.NEO.symbol
// };

// async function test() {
//   let api = new InfinitApi(opts);
//   let wallet = new WalletNeo(opts);
//   console.log('wallet neo: ' + JSON.stringify(wallet.Account.address));
//   wallet.setApi(api);

//   // NEO c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b
//   // GAS 602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7
//   // console.log(wallet.Account.validateAddress(wallet.Account.address));
//   // wallet.getBalance('c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b').then(data => {
//   //   console.log(data);
//   // });

//   wallet.getHistory().then(data => {
//     console.log(data);
//   })
//   // console.log('wallet[BTC]: ' + JSON.stringify(wallet.Accounts[CoinType.BTC.symbol]));
//   // let result = await wallet.Accounts[CoinType.BTC.symbol].getBalance();
//   // console.log('result getBalance BTC: ' + JSON.stringify(result));
//   //let result = await wallet.Accounts[CoinType.BTC.symbol].send('mt2EqmgkCKdwuM1N6N9PdsdPWBwCAh4YSE', 0.02);
//   //console.log('result send BTC: ' + JSON.stringify(result));
// }

// test();