const Wallet = require('../lib/wallet');
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
  coinType: CoinType.BTC.symbol,
  isTestNet: true,
  privateKey: 'cVg2gYrsfHBf4iBWncrm86VHd1VqcUCFdJ9FJtLbdLfwvqc1eL6v'
  //f170b01f106f1ba37d87a19a0e7a02de93bc9364d09d52cd04345bde9453937c
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
      console.log('getAddress', result);
      Assert.ok(result.addr !== undefined, 'address must be exist');
    });
  });

  describe('#getFeeRate()', async () => {
    it('get FeeRate', async () => {
      let result = await wallet.getDefaultFee();
      console.log('getFeeRate', result);
      Assert.ok(result !== undefined, 'address must be exist');
    });
  });


  describe('#send()', async () => {
    it.only('Send', async () => {
      let result = await wallet.send({
        txParams: {
          to: 'mssJexznaEypEfeLGf4v7J2WvKX6vFAjrs',
          amount: 1000,
          fee: 50
        }
      }, true);
      console.log('Send', result);
      Assert.ok(result.raw !== undefined, 'raw must be exist');
    });
  });
});