const Assert = require('assert');
const chai = require('chai');
const { Wallet, CoinType, InfinitoApi } = require('../index');
const ConfigTest = require('./config.test');
chai.should();

let apiConfig = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL
};

let walletConfig = {
  coinType: CoinType.LTC.symbol,
  isTestNet: true
    // privateKey: 'cNAxZ8z4yMeRUuqXGTnZ5dPsMYQayA1LEsJQYAZn4veqxMt7jPSM'
    // QiqbgFSAmKEC9ws3oanCiTsmiiwDq74Thb
    // mxmf2VYt6L9YzbzaQzBpr7WTcyQV4L434Q
};

var wallet = null;

describe('wallet.ltc', async() => {
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
          to: 'mrekeohAmra9GtJdAGkZTqQkzUzHSVKWA5',
          // f048911646960d35c693ae21a3c10dfe2498de9c66b9ca6ab63b2a1d56920fee
          amount: 10
        }
      });
      Assert.ok(result.raw !== undefined, 'raw must be exist');
    });
  });
});