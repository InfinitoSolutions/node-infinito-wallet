const Wallet = require('../lib/wallet_eth');
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
  coinType: CoinType.ETH.symbol,
  isTestNet: true,
  // privateKey: '0x77d6f0d8768942c098e664bb4e930c5019755b90d6b0fb2fb43450d6270efb3d'
  // '0x6426b293207e124d334c8cb44380a4999ecc900e'

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
      Assert.ok(result.transactions !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', () => {
    it.only('Get address', () => {
      let result = wallet.getAddress();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getNonce()', async () => {
    it('Get nonce', async () => {
      let result = await wallet.getNonce();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getTxCount()', async () => {
    it('Get TxCount', async () => {
      let result = await wallet.getTxCount();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getTxAddress()', async () => {
    it('Get TxAddress', async () => {
      let result = await wallet.getTxAddress(0, 10);
      Assert.ok(result.transactions !== undefined, 'transactions must be exist');
    });
  });

  describe('#getInternalTxAddress()', async () => {
    it('Get InternalTxAddress', async () => {
      let result = await wallet.getInternalTxAddress(0, 10);
      Assert.ok(result.transactions !== undefined, 'transactions must be exist');
    });
  });

  describe('#getContract()', async () => {
    it('Get Contract', async () => {
      let result = await wallet.getContract();
      Assert.ok(result.contracts !== undefined, 'contracts must be exist');
    });
  });

  describe('#getSmartContractInfo()', async () => {
    it('Get SmartContractInfo', async () => {
      let result = await wallet.getSmartContractInfo('0x9d539c8534c156d76828992fd55a16f79afa9a36');
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getContractBalance()', async () => {
    it('Get ContractHistory', async () => {
      let result = await wallet.getContractBalance('0x9d539c8534c156d76828992fd55a16f79afa9a36');
      Assert.ok(result.balance !== undefined, 'balance must be exist');
    });
  });

  describe('#getContractHistory()', async () => {
    it('Get ContractHistory', async () => {
      let result = await wallet.getContractHistory('0x9d539c8534c156d76828992fd55a16f79afa9a36', 0, 10);
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#send()', async () => {
    it('Send', async () => {
      let result = await wallet.send({
        txParams: {
          to: '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c',
          amount: 12000000000,
          gasLimit: 300000,
          gasPrice: 40000000000
        },
        isBroadCast: true
      });
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });

  describe('#transfer()', async () => {

    it('transfer', async () => {
      // 0xad0c4aecee4761f82b8dd37431f57a41d95815ac
      // 0x9d539c8534c156d76828992fd55a16f79afa9a36
      let result = await wallet.transfer('0x9d539c8534c156d76828992fd55a16f79afa9a36', '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c', 10000);
      console.log('result transfer ETH: ' + JSON.stringify(result));
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });
});