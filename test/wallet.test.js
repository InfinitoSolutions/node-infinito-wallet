const Wallet = require('../lib/wallet');
const ConfigTest = require('./config/config.test.staging.testnet');
const CoinType = require('../lib/support_coin');
const InfinitApi = require('node-infinito-api');
const Assert = require('assert');
const chai = require("chai");
chai.should();

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
  coinType: CoinType.BTC.symbol,
  isTestNet: true,
  wif: 'cVg2gYrsfHBf4iBWncrm86VHd1VqcUCFdJ9FJtLbdLfwvqc1eL6v'
};
var wallet = null;

describe('wallet.btc', async () => {

  beforeEach(async () => {
    let api = new InfinitApi(opts);
    wallet = new Wallet(opts);
    wallet.setApi(api);
  });

  describe('#getBalance()', async () => {
    it('Get balance', async () => {
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'balance must be exist');
      Assert.ok(result.unconfirmed_balance !== undefined, 'unconfirmed_balance must be exist');
    });
  });

  describe('#getHistory()', async () => {
    it('Get history', async () => {
      let result = await wallet.getHistory(0, 10);
      Assert.ok(result.txs !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', async () => {
    it('Get address', async () => {
      let result = await wallet.getAddress();
      console.log(result.addr);
      Assert.ok(result.addr !== 'mssJexznaEypEfeLGf4v7J2WvKX6vFAjrs', 'address must be exist');
    });
  });

  describe('#send()', async () => {
    it.only('Send', async () => {
      let result = await wallet.send('mssJexznaEypEfeLGf4v7J2WvKX6vFAjrs', 0.01, 100, true);
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });
});