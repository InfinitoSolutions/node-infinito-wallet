const Assert = require('assert');
const chai = require('chai');
const { Wallet, CoinType, InfinitoApi } = require('../index');
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

describe('wallet.bch', async() => {
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
        coinType: CoinType.DASH.symbol,
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });

      Assert.equal('DASH', wallet.account.coinType);
      Assert.equal('0208dfadc24f0fd51240c41e25fc1bb02d1d40a6631d9de4e714b0cb17bfb251a4', wallet.account.publicKey);
      Assert.equal('XmQHB65QdsqKkif7hPXN2y674ANGtixJ39', wallet.account.address);
    });
  });

  describe('#getAddress()', async() => {
    it('Mnemonic.Mainnet', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest'
      });

      Assert.equal(wallet.getAddress(), 'Xdpi5iHA1DccirBq25S1JWhA5drcHXjwzM', 'Address must be right');
    });

    it('Mnemonic.Testnet', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest',
        isTestNet: true
      });

      Assert.equal(wallet.getAddress(), 'ydGaoEDXtgjNqDNDKF1aDYpjoCV6vucVYn', 'Address must be right');
    });

    it('PrivateKey.Mainnet', async() => {
      const keymaps = [
        ['Xnek4Bqm6nSVqDL9DXPCUizdFxS6XRFvHN', '7rqc4hYXbFf2pRp1XFWPDkv8BUYy24RWREKwdMeUqenNMN1Uypj'],
        ['Xgf34vuDy4jXdUmXMTptuM97Axn2bPe2AZ', '7rw1mT94nQsbYVZnK7t4gkK9xwSrRtQ8shtwUkTw5s4oFCTBGK7'],
        ['Xm5nxm2VJxNMK8W6ixUWKhk55TeZZ1ocJy', '7rcyuKZsUhYhaxdEsNrqXNPEq5egoaTyUUDb7sD4JybQxkPNNvg'],
        ['XmDKj4MoCxB4c9xV1zhDCgRiQAfAfsDZ72', '7qqMg94JzhzBYcYVMDsKTkN6wApKEzED74kSendYEK8ZpH7cCs3'],
        ['XucojjZVhsynv8TqRuAjjY3uA5PLZivB4p', '7rhGqxN9GrCnk7EhdYnYpySB3mvyoJsvu4z4Yb6qduE1ecGaZGG']
      ];

      keymaps.forEach((keymap) => {
        let wallet = new Wallet({
          coinType: CoinType.DASH.symbol,
          privateKey: keymap[1]
        });

        Assert.equal(wallet.getAddress(), keymap[0], `Address must be right. ${JSON.stringify(keymap)}`);
      });
    });
    it('PrivateKey.Testnet', async() => {
      const keymaps = [
        ['yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK', '7rqc4hYXbFf2pRp1XFWPDkv8BUYy24RWREKwdMeUqenNMN1Uypj'],
        ['ySHe5syfQcPbyDh4vK9HwNZTTFGQ7FxLeW', '7rw1mT94nQsbYVZnK7t4gkK9xwSrRtQ8shtwUkTw5s4oFCTBGK7'],
        ['yWiPyi6vkW2ResReHonuMjARMk8w7EFnNq', '7rcyuKZsUhYhaxdEsNrqXNPEq5egoaTyUUDb7sD4JybQxkPNNvg'],
        ['yWqvk1SEeVq8wtt2ar1cEhr4gT9YCE6CKf', '7qqMg94JzhzBYcYVMDsKTkN6wApKEzED74kSendYEK8ZpH7cCs3'],
        ['yfFQkgdw9RdsFsPNzkV8mZUFSMsi5TKTSS', '7rhGqxN9GrCnk7EhdYnYpySB3mvyoJsvu4z4Yb6qduE1ecGaZGG']
      ];

      keymaps.forEach((keymap) => {
        let wallet = new Wallet({
          coinType: CoinType.DASH.symbol,
          privateKey: keymap[1],
          isTestNet: true
        });

        Assert.equal(wallet.getAddress(), keymap[0], `Address must be right. ${JSON.stringify(keymap)}`);
      });
    });
  });

  describe('#getBalance()', async() => {
    it('Mnemonic.Mainnet', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        mnemonic: ConfigTest.MNEMONIC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'Balance must be exist');
      Assert.ok(result.unconfirmed_balance !== undefined, 'Balance must be exist');
    });

    it('PrivateKey.Testnet', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });

      wallet.setApi(getApi(true));
      let result = await wallet.getBalance();
      Assert.ok(result.balance > 0, 'Balance must be exist');
      Assert.ok(result.unconfirmed_balance !== undefined, 'Balance must be exist');
    });
  });

  describe('#getHistory()', async() => {
    it('default', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getHistory();
      Assert.ok(result.txs.length >= 0, 'History must be exist');
    });

    it('offset.limit', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getHistory(0, 1);
      Assert.ok(result.txs.length == 1, 'History must have one item');
    });

    it('offset = 50', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getHistory(50, 50);
      Assert.ok(result.txs.length == 0, 'History must be empty');
    });
  });

  describe('#getDefaultFee()', async() => {
    it('default', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee();
      Assert.ok(result > 0);
    });
    it('high', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('high');
      Assert.ok(result > 0);
    });
    it('medium', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('medium');
      Assert.ok(result > 0);
    });
    it('low', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('low');
      Assert.ok(result > 0);
    });
    it('error', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let api = wallet.getApi();
      api.DASH.getFeeRate = function() {
        return { cd: 1 };
      };
      try {
        await wallet.getDefaultFee('low');
        Assert.fail();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.internal_error');
      }
    });
  });

  describe('#createRawTx()', async() => {
    it('Missing parameter to', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({});
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter to');
      }
    });

    it('Missing parameter fee', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter fee or feeType');
      }
    });

    it('Invalid feeType', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
          feeType: 'InValid'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (feeType)');
      }
    });

    it('Invalid fee', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
          fee: 'InValid'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('fee = 0', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
          fee: 0
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('fee < 0', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
          fee: -1
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('default', async() => {

      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let listUnspent = [{
          'tx_id': '1e13afb2b3c1afcd7751298cd72af6d68a90eb1c018990f483f3f1bbf61c09e8',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 606,
          'amount': 9000
        }];
      let createResult = await wallet.createRawTx({
        to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
        fee: 5,
        amount: 1000,
        listUnspent
      });

      Assert.ok(createResult.fee > 0, 'Fee must be right');
      Assert.ok(createResult.tx_id.length > 0, 'Tx id must be right');
      Assert.ok(createResult.raw.length > 0, 'Raw must be right');
    });

    it('feeType = high', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let listUnspent = [{
          'tx_id': '1e13afb2b3c1afcd7751298cd72af6d68a90eb1c018990f483f3f1bbf61c09e8',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 606,
          'amount': 9000
        }];
      let createResult = await wallet.createRawTx({
        to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
        feeType: 'high',
        amount: 1000,
        listUnspent
      });

      Assert.ok(createResult.fee > 0, 'Fee must be right');
      Assert.ok(createResult.tx_id.length > 0, 'Tx id must be right');
      Assert.ok(createResult.raw.length > 0, 'Raw must be right');
    });

    it('OVER_BALANCE', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let createResult = await wallet.createRawTx({
        to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
        fee: 5,
        amount: 10000000
      });

      Assert.equal(createResult.error, 'OVER_BALANCE');
    });

    it('Fail to get utxo', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });
      let api = getApi(true);
      wallet.setApi(api);
      api.DASH.getUtxo = function() {
        return { cd: 1 };
      };
      try {
        await wallet.createRawTx({
          to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
          fee: 5,
          amount: 100000
        });
        Assert.fail();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.can_not_get_utxo');
        Assert.equal(err.message, "Can't get utxo.");
      }
    });
  });

  describe('#send()', async() => {
    it('send invalid raw transaction', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      let rawTx = '100000001e8091cf6bbf1f383f49089011ceb908ad6f62ad78c295177cdafc1b3b2af131e0000000000ffffffff02e8030000000000001976a914f65f9ef810028c9e642ed1f149a254fa020be86c88ac40130000000000001976a9146273d8f8c8c41f3980adbc15b7a5509eb38372d288ac00000000';
      try {
        await wallet.send({ rawTx });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.send_transaction_fail');
        Assert.ok(err.message.indexOf('decode hex') > 0);
      }
    });

    it('No rawTx & txParam', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      try {
        await wallet.send({});
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter rawTx or txParams');
      }
    });

    it('fail to create raw', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      try {
        await wallet.send({
          txParams: {
            to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
            fee: 5,
            amount: 1000000000
          }
        });
        Assert.fail();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.create_rawtx_fail');
        Assert.equal(err.message, 'Fail when create raw transaction');
      }
    });

    it('broadcast with custom fee', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let sendResult = await wallet.send({
        txParams: {
          to: 'yYHM58vCYL6aAxFgnNhbWkQyYEvU8CX3XK',
          fee: 5,
          amount: 1
        }
      });

      sendResult.should.have.property('tx_id');
      Assert.ok(sendResult.tx_id.length > 0);
    });

    it('do not broadcast', async() => {
      let wallet = new Wallet({
        coinType: CoinType.DASH.symbol,
        privateKey: ConfigTest.PRIVATE_KEY_DASH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      let rawTx = '0200000001da8c213e9cede4f75ad5c9023d7871781aa36102bf4bd12d59d004c26172c6cc000000006b483045022100ee0a66581681c105db89a89e0341e25b3708ffed3cd54a4fe7e51e4f4cc850280220741d37eea40c9064676cbb034611e36198f4281b2131f05984592cf2451225010121025cdbb5e871e74b2749388e1534f441d5d39a64bed8d1909315bde3bbee0cb138feffffff01e0a54b00000000001976a91441fd36eef3a1bcdb94dead1a24650d9e7f31e90a88ac00000000';
      let result = await wallet.send({ rawTx, isBroadCast: false });
      Assert.ok(result.raw.length > 0);
    });
  })
})
