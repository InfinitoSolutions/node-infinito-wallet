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
  coinType: CoinType.DOGE.symbol,
  isTestNet: true,
  privateKey: '6826242ed3b84ec1f18f940a7aa08f75f200a55dc6b91daae1f802a5c8a7abd9'
    // nXTqWa8Zj3SfAjfoSoK2kqCdsdGCLrAgCs
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
          to: 'neE1xfrjiL5KFrw1f7AKXGQ2uQ4MUg7Ler',
          // 5bd156f8f0d6f3e9123288fa81bb8f8764436e9bfad14827e865f2386f9a9454
          amount: 10000
        }
      });
      Assert.ok(result.raw !== undefined, 'raw must be exist');
    });
  });
});