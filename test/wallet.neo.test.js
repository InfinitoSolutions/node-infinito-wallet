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

const NeoWallet = require('../lib/wallet_neo');
const ConfigTest = require('./config/config.test.staging.testnet');
const CoinType = require('../lib/coin_type');
const InfinitApi = require('node-infinito-api');
const Assert = require('assert');
const chai = require('chai');
chai.should();

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
  coinType: CoinType.NEO.symbol,
  isTestNet: true,
  privateKey: 'L3uKA9vRFoFzLE2M9i4M846QtFsVcPGJtzyLPbfcxn2gRArcS2dz'
};

var wallet = null;

describe('wallet.neo', async () => {

  beforeEach(async () => {
    let api = new InfinitApi(opts);
    wallet = new NeoWallet(opts);
    wallet.setApi(api);
  });

  describe('#getBalance()', async () => {
    it('Get balance', async () => {
      let result = await wallet.getBalance('c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b');
      Assert.ok(result.assets !== undefined, 'balance must be exist');
    });
  });

  describe('#getHistory()', async () => {
    it.only('Get history', async () => {
      let result = await wallet.getHistory(0, 10);
      console.log(result);
      Assert.ok(result.txs !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', async () => {
    it('Get address', async () => {
      let result = await wallet.getAddress();
      console.log('getAddress', result);
      Assert.ok(result.addr !== undefined, 'address must be exist');
    });
  });

  /* describe('#send()', async () => {
    it.only('Send', async () => {
      let result = await wallet.send({
        txParams: {
          to: 'mssJexznaEypEfeLGf4v7J2WvKX6vFAjrs',
          amount: 0.01,
          feePerB: 100
        }
      }, true);
      console.log('Send', result);
      Assert.ok(result.tx_hex !== undefined, 'tx_hex must be exist');
    });
  });*/
});