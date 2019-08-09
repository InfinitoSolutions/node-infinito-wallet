const Assert = require('assert');
const wif = require('wif');
const Account = require('../../lib/account/bitcoin');
const ConfigTest = require('../../config.test');

describe('account.index', async() => {

  describe('#constructor()', async() => {

    it('Mising option', async() => {
      try {
        new Account();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter', 'Must be error');
      }
    });

    it('BTC.testnet', async() => {
      let account = new Account({ coinType: 'BTC', isTestNet: true });
      Assert.equal(account.coinType, 'BTC', 'coinType must be right');
      Assert.equal(account.isTestNet, true);
      Assert.equal(account.network.messagePrefix, '\u0018Bitcoin Signed Message:\n');
      Assert.ok(account.address.length > 0, 'address must be exists');
      Assert.ok(account.privateKey.length > 0, 'privateKey must be exists');
      Assert.ok(account.publicKey.length > 0, 'publicKey must be exists');
    });

    it('BTC.testnet.privatekey', async() => {
      let account = new Account({
        coinType: 'BTC',
        isTestNet: true,
        privateKey: ConfigTest.PRIVATE_KEY_BTC
      });

      let decode = wif.decode(ConfigTest.PRIVATE_KEY_BTC);
      Assert.equal(account.coinType, 'BTC', 'coinType must be right');
      Assert.equal(account.isTestNet, true);
      Assert.equal(account.network.messagePrefix, '\u0018Bitcoin Signed Message:\n');
      Assert.equal(account.address, 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T', 'address must be equal');
      Assert.equal(account.privateKey, decode.privateKey.toString('hex'), 'private key must be equal');
    });
  });

});