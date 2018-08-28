const Wallet = require('../lib/wallet_eth');
const ConfigTest = require('./config/config.test.staging.testnet');
const CoinType = require('../lib/support_coin');
const InfinitApi = require('node-infinito-api');
const Assert = require('assert');
const chai = require('chai');
chai.should();

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
  coinType: CoinType.ETH.symbol,
  isTestNet: true,
  privateKey: '0x77d6f0d8768942c098e664bb4e930c5019755b90d6b0fb2fb43450d6270efb3d'
  //'0x6426b293207e124d334c8cb44380a4999ecc900e'

};
var wallet = null;

describe('wallet.eth', async () => {

  beforeEach(async () => {
    let api = new InfinitApi(opts);
    wallet = new Wallet(opts);
    wallet.setApi(api);
  });

  describe('#getBalance()', async () => {
    it('Get balance', async () => {
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'balance must be exist');
    });
  });

  describe('#getHistory()', async () => {
    it('Get history', async () => {
      let result = await wallet.getHistory(0, 10);
      console.log('getHistory', result);
      Assert.ok(result.transactions !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', async () => {
    it('Get address', async () => {
      let result = await wallet.getAddress();
      console.log('getAddress 11', result);
      Assert.ok(result.addr !== undefined, 'address must be exist');
    });
  });

  describe('#getNonce()', async () => {
    it('Get nonce', async () => {
      let result = await wallet.getNonce();
      console.log('getnonce', result);
      Assert.ok(result.nonce !== undefined, 'nonce must be exist');
    });
  });

  describe('#send()', async () => {
    it.only('Send', async () => {
      let result = await wallet.send({
        txParams: {
          to: '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c',
          value: 12000000000,
          gasLimit: 300000,
          gasPrice: 40000000000
        },
        isBroadCast: true
      });
      console.log('result send ETH: ' + JSON.stringify(result));
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });
});