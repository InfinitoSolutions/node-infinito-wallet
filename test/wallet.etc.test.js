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
  coinType: CoinType.ETC.symbol,
  isTestNet: true,
  privateKey: '0xa2365198cb10309a5afdf0683c0c285410313839f7ccbd66aac068fcfe5b72ee'
    // '0x5f7ec793ed8aec6d8817e287434b5095895c9b6c'
};

var wallet = null;

describe('wallet.etc', async() => {
  beforeEach(async() => {
    let api = new InfinitoApi(apiConfig);
    wallet = new Wallet(walletConfig);
    wallet.setApi(api);
  });

  describe('#getBalance()', async() => {
    it('Get balance', async() => {
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'balance must be exist');
    });
  });

  describe('#getHistory()', async() => {
    it('Get history', async() => {
      let result = await wallet.getHistory(0, 10);
      Assert.ok(result.transactions !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', () => {
    it('Get address', () => {
      let result = wallet.getAddress();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getNonce()', async() => {
    it('Get nonce', async() => {
      let result = await wallet.getNonce();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getTxCount()', async() => {
    it('Get TxCount', async() => {
      let result = await wallet.getTxCount();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getTxAddress()', async() => {
    it('Get TxAddress', async() => {
      let result = await wallet.getTxAddress(0, 10);
      Assert.ok(
        result.transactions !== undefined,
        'transactions must be exist'
      );
    });
  });

  describe('#getInternalTxAddress()', async() => {
    it('Get InternalTxAddress', async() => {
      let result = await wallet.getInternalTxAddress(0, 10);
      Assert.ok(
        result.transactions !== undefined,
        'transactions must be exist'
      );
    });
  });

  describe('#getSmartContractInfo()', async() => {
    it('Get SmartContractInfo', async() => {
      let result = await wallet.getSmartContractInfo(
        '0x9d539c8534c156d76828992fd55a16f79afa9a36'
      );
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getContractBalance()', async() => {
    it('Get ContractHistory', async() => {
      let result = await wallet.getContractBalance(
        '0x9d539c8534c156d76828992fd55a16f79afa9a36'
      );
      Assert.ok(result.balance !== undefined, 'balance must be exist');
    });
  });

  describe('#getContractHistory()', async() => {
    it('Get ContractHistory', async() => {
      let result = await wallet.getContractHistory(
        '0x9d539c8534c156d76828992fd55a16f79afa9a36',
        0,
        10
      );
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#send()', async() => {
    it('Send', async() => {
      let result = await wallet.send({
        txParams: {
          to: '0xa481871cd544979e3f1650fda97bc208abdc894e',
          // 0x665cf6083e074f113d5da501763710aa138033c5c3bbd57b30f781ed86b6d5c4
          amount: 12000000000,
          gasLimit: 300000,
          gasPrice: 40000000000
        },
        isBroadCast: true
      });
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });

  describe('#transfer()', async() => {
    it('transfer', async() => {
      // 0xad0c4aecee4761f82b8dd37431f57a41d95815ac
      // 0x9d539c8534c156d76828992fd55a16f79afa9a36
      let result = await wallet.transfer(
        '0x9d539c8534c156d76828992fd55a16f79afa9a36',
        '0xa481871cd544979e3f1650fda97bc208abdc894e',
        10000
      );
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });
});