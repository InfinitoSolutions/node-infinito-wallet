const { Wallet, CoinType, InfinitoApi } = require('../index');
const ConfigTest = require('./config.test');
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
  coinType: CoinType.DASH.symbol,
  isTestNet: true,
  privateKey: '6ce3ccd1b5a958a7ed3b23fa5785796415e30306c0ddfe4cdb64efb4074bd679'
    // yRYtyKurDQipoaHCiDyz4rZ6QAiewSEz9k
};

var wallet = null;

describe('wallet.dash', async() => {
  beforeEach(async() => {
    let api = new InfinitoApi(apiConfig);
    wallet = new Wallet(walletConfig);
    wallet.setApi(api);
  });

  describe('#getBalance()', async() => {
    it('Get balance', async() => {
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'balance must be exist');
      Assert.ok(
        result.unconfirmed_balance !== undefined,
        'unconfirmed_balance must be exist'
      );
    });
  });

  describe('#getHistory()', async() => {
    it('Get history', async() => {
      let result = await wallet.getHistory(0, 10);
      Assert.ok(result.txs !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', async() => {
    it('Get address', () => {
      let result = wallet.getAddress();
      Assert.ok(result !== undefined, 'address must be exist');
    });
  });

  describe('#getFeeRate()', async() => {
    it('get FeeRate', async() => {
      let result = await wallet.getDefaultFee();
      Assert.ok(result !== undefined, 'address must be exist');
    });
  });

  describe('#send()', async() => {
    it('Send', async() => {
      let result = await wallet.send({
        txParams: {
          to: 'ybsb5WrLX8eE9Wu74Kdmh1ksprenrrxoNc',
          // dcb4cafb668be8bad50da4c1ae8e880b8f9ce1ac7884c076fb49864920e7ef16
          amount: 10000
        }
      });
      Assert.ok(result.raw !== undefined, 'raw must be exist');
    });
  });
});