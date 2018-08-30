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
  // APtUVHSAEchsCd6HPrmWXKAK7SETxhAvjU
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
      console.log('getBalance', result);
      Assert.ok(result.assets !== undefined, 'balance must be exist');
    });
  });

  describe('#getHistory()', async () => {
    it('Get history', async () => {
      let result = await wallet.getHistory(0, 10);
      console.log(result);
      Assert.ok(result.transactions !== undefined, 'history must be exist');
    });
  });

  describe('#createRawTx()', async () => {
    it('createRawTx', async () => {
      let result = await wallet.createRawTx({
        to: 'APtUVHSAEchsCd6HPrmWXKAK7SETxhAvjU',
        amount: 1,
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        assetSymbol: 'NEO'
      })
      console.log('createRawTx', result);
      Assert.ok(result !== '', 'tx_hex must be exist');
    });
  });

  describe('#send()', async () => {
    it.only('Send', async () => {
      let result = await wallet.send({
        txParams: {
          to: 'APtUVHSAEchsCd6HPrmWXKAK7SETxhAvjU',
          amount: 1,
          assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
          assetSymbol: 'NEO'
        }
      });
      console.log('Send', result);
      Assert.ok(result.tx_id !== undefined, 'tx_id must be exist');
    });
  });

  describe('#transfer()', async () => {

    it('transfer', async () => {
      let result = await wallet.transfer('0x9d539c8534c156d76828992fd55a16f79afa9a36', 'APtUVHSAEchsCd6HPrmWXKAK7SETxhAvjU', 1);
      console.log('result transfer NEO: ' + JSON.stringify(result));
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });
});