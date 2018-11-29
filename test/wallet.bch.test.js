const { Wallet, CoinType, InfinitoApi } = require('../index');
const ConfigTest = require('./config/config.test.staging.testnet');
const Assert = require('assert');
const chai = require('chai');
chai.should();

let apiConfig = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL
};

let walletConfig = {
  coinType: CoinType.BCH.symbol,
  isTestNet: true,
  privateKey: 'cNqemSkkxjtbe4VQp92TMrMdCz434RHcRtAADM8cRoC2nWnjY4Do'
  // mssJexznaEypEfeLGf4v7J2WvKX6vFAjrs
};

var wallet = null;

describe('wallet.btc', async () => {
  beforeEach(async () => {
    let api = new InfinitoApi(apiConfig);
    wallet = new Wallet(walletConfig);
    wallet.setApi(api);
  });

  describe('#getBalance()', async () => {
    it.only('Get balance', async () => {
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'balance must be exist');
      Assert.ok(
        result.unconfirmed_balance !== undefined,
        'unconfirmed_balance must be exist'
      );
    });
  });

  describe('#getHistory()', async () => {
    it('Get history', async () => {
      let result = await wallet.getHistory(0, 10);
      Assert.ok(result.txs !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', async () => {
    it('Get address', () => {
      let result = wallet.getAddress();
      Assert.ok(result !== undefined, 'address must be exist');
    });
  });

  describe('#getFeeRate()', async () => {
    it('get FeeRate', async () => {
      let result = await wallet.getDefaultFee();
      Assert.ok(result !== undefined, 'address must be exist');
    });
  });

  describe('#send()', async () => {
    it.only('Send', async () => {
      let result = await wallet.send({
        txParams: {
          to: 'mk1GTLuF89WtiNSHujpWXyHK579AcPc59D',
          amount: 13000000
        }
      });
      Assert.ok(result.raw !== undefined, 'raw must be exist');
    });
  });
});
