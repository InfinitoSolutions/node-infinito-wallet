const Assert = require('assert');
const Account = require('../../lib/account');

describe('account.index', async() => {

  describe('#constructor()', async() => {
    it('Mising option', async() => {
      try {
        new Account();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_cointype', 'Must be error');
      }
    });
    it('Invalid cointype', async() => {
      try {
        new Account({ coinType: 'INVALID' });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_cointype', 'Must be error');
      }
    });
    it('BTC', async() => {
      let account = new Account({ coinType: 'BTC' });
      Assert.equal(account.constructor.name, 'BitcoinAccount', 'Must be right account class');
    });
    it('BCH', async() => {
      let account = new Account({ coinType: 'BCH' });
      Assert.equal(account.constructor.name, 'BitcoinCashAccount', 'Must be right account class');
    });
    it('LTC', async() => {
      let account = new Account({ coinType: 'LTC' });
      Assert.equal(account.constructor.name, 'BitcoinAccount', 'Must be right account class');
    });
    it('DOGE', async() => {
      let account = new Account({ coinType: 'DOGE' });
      Assert.equal(account.constructor.name, 'BitcoinAccount', 'Must be right account class');
    });
    it('DASH', async() => {
      let account = new Account({ coinType: 'DASH' });
      Assert.equal(account.constructor.name, 'BitcoinAccount', 'Must be right account class');
    });
    it('ETH', async() => {
      let account = new Account({ coinType: 'ETH' });
      Assert.equal(account.constructor.name, 'EthAccount', 'Must be right account class');
    });
    it('ETC', async() => {
      let account = new Account({ coinType: 'ETC' });
      Assert.equal(account.constructor.name, 'EthAccount', 'Must be right account class');
    });
    it('NEO', async() => {
      let account = new Account({ coinType: 'NEO' });
      Assert.equal(account.constructor.name, 'NeoAccount', 'Must be right account class');
    });
  });

});