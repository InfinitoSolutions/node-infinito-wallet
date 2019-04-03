const Assert = require('assert');
const chai = require('chai');
const { Wallet, CoinType, InfinitoApi, EthWallet } = require('../index');
const ConfigTest = require('./config.test');
chai.should();

let apiConfigMainnet = {
  apiKey: ConfigTest.API_KEY_MAINNET,
  secret: ConfigTest.SECRECT_MAINNET,
  baseUrl: ConfigTest.BASE_URL_MAINNET,
  logLevel: ConfigTest.LOG_LEVEL
};

let apiConfigTestnet = {
  apiKey: ConfigTest.API_KEY_TESTNET,
  secret: ConfigTest.SECRECT_TESTNET,
  baseUrl: ConfigTest.BASE_URL_TESTNET,
  logLevel: ConfigTest.LOG_LEVEL
};

function getApi(isTestnet = true) {
  if (isTestnet) {
    return new InfinitoApi(apiConfigTestnet);
  }
  return new InfinitoApi(apiConfigMainnet);
}

describe('wallet.ETC', async() => {

  describe('#constructor()', async() => {
    it('No Parameter', async() => {
      try {
        new Wallet();
        Assert.fail();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_cointype');
      }
    });
    it('Default cointype', async() => {
      let wallet = new Wallet({
        coinType: CoinType.ETC.symbol,
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });

      // console.log(wallet)

      Assert.equal('ETC', wallet.account.coinType);
      Assert.equal('0x284a84bbecc0f9bff1a929039c499fde10a548462818a6f94060b41a970fbb36', wallet.account.privateKey);
      Assert.equal('0xca08449856ec7a1be9adda1dac9a40d4a17c5a43', wallet.account.address);
    });
  });

  describe('#getBalance()', async() => {
    it('Get balance', async() => {
      let wallet = new Wallet({
        coinType: CoinType.ETC.symbol,
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });
      wallet.setApi(getApi(false));      
      let result = await wallet.getBalance();
      // console.log("bbbb", result)
      Assert.ok(result.balance !== undefined, 'balance must be exist');
    });
  });

  describe('#getNonce()', async() => {
    it('Get nonce', async() => {
      let wallet = new Wallet({
        coinType: CoinType.ETC.symbol,
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });
      wallet.setApi(getApi(false));        
      let result = await wallet.getNonce();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  }); 

  describe('#getHistory()', async() => {
    it('Get history', async() => {
      let wallet = new Wallet({
        coinType: CoinType.ETC.symbol,
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });
      wallet.setApi(getApi(false));      
      let result = await wallet.getHistory(0, 10);
      Assert.ok(result.transactions !== undefined, 'history must be exist');
    });
  }); 

  describe('#getAddress()', async() => {
    it('Get address', async() => {
      let wallet = new Wallet({
        coinType: CoinType.ETC.symbol,
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });
      wallet.setApi(getApi(false));      
      let result = await wallet.getAddress();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });
});
