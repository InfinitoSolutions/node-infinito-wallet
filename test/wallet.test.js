const { Wallet } = require('../index');
const Assert = require('assert');

describe('wallet', async() => {

  describe('#constructor()', async() => {
    it("default", async() => {
      try {
        let wallet = new Wallet();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_cointype', 'Must be error')
      }
    });

    it("Unknown", async() => {
      try {
        let wallet = new Wallet({ coinType: 'UNKNOWN' });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_cointype', 'Must be error')
      }
    });

    it("BTC", async() => {
      let wallet = new Wallet({ coinType: 'BTC' });
      Assert.equal(wallet.constructor.name, 'BtcWallet', 'Must be right wallet class');
    });

    it("BCH", async() => {
      let wallet = new Wallet({ coinType: 'BCH' });
      Assert.equal(wallet.constructor.name, 'BchWallet', 'Must be right wallet class');
    });

    it("DOGE", async() => {
      let wallet = new Wallet({ coinType: 'DOGE' });
      Assert.equal(wallet.constructor.name, 'BtcWallet', 'Must be right wallet class');
    });

    it("LTC", async() => {
      let wallet = new Wallet({ coinType: 'LTC' });
      Assert.equal(wallet.constructor.name, 'BtcWallet', 'Must be right wallet class');
    });

    it("DASH", async() => {
      let wallet = new Wallet({ coinType: 'DSH' });
      Assert.equal(wallet.constructor.name, 'BtcWallet', 'Must be right wallet class');
    });

    it("ETH", async() => {
      let wallet = new Wallet({ coinType: 'ETH' });
      Assert.equal(wallet.constructor.name, 'EthWallet', 'Must be right wallet class');
    });

    it("ETC", async() => {
      let wallet = new Wallet({ coinType: 'ETC' });
      Assert.equal(wallet.constructor.name, 'EthWallet', 'Must be right wallet class');
    });

    it("NEO", async() => {
      let wallet = new Wallet({ coinType: 'NEO' });
      Assert.equal(wallet.constructor.name, 'NeoWallet', 'Must be right wallet class');
    });
  });

});