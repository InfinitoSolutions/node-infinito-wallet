const Assert = require('assert');
const chai = require('chai');
const { Wallet, CoinType, InfinitoApi, BchWallet } = require('../index');
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

let walletConfig = {
  coinType: CoinType.BCH.symbol,
  isTestNet: true,
  privateKey: 'cNqemSkkxjtbe4VQp92TMrMdCz434RHcRtAADM8cRoC2nWnjY4Do'
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
        new BchWallet();
        Assert.fail();
      } catch (err) {
        Assert.equal(err.message, 'Missing required parameter options');
      }
    });
    it('Default cointype', async() => {
      let wallet = new BchWallet({
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });

      Assert.equal('BCH', wallet.account.coinType);
      Assert.equal('023d3c885909865a3c7c19ce616ef415a6e82931abd0b9a3b1bd1ab321d122fc37', wallet.account.publicKey);
      Assert.equal('1JqXUu4AWHgPBCqA3NnQd39HcvPjk5RMrp', wallet.account.address);
    });
  });

  describe('#getAddress()', async() => {
    it('Mnemonic.Mainnet', async() => {
      let wallet = new BchWallet({
        mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest'
      });

      Assert.equal(wallet.getAddress(), '1K6hEuHZiWyhjmqpo5x21o3AeAR5gc7ysJ', 'Address must be right');
    });

    it('Mnemonic.Testnet', async() => {
      let wallet = new BchWallet({
        mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest',
        isTestNet: true
      });

      Assert.equal(wallet.getAddress(), 'mxU6F5aBJTHy7eKhc5ML9uvvYa1kM5sKEJ', 'Address must be right');
    });

    it('PrivateKey.Mainnet', async() => {
      const keymaps = [
        ['1K35Ujjagykycu6fS7cL5hank4Kj2JUGyn', '5K3qUigm18J5w9cmuJL3wp8X57tmMxsc37zPGSMptEWuyzs3BWA'],
        ['1C2E6w3uGxM2vSEBW2eS5JBYAHgZnDKSPf', '5K1zwJw4p4B7DX1XksabXRhY332uYbYZB9zK7kJJeYDdH6N4nxF'],
        ['1BBLypxDMdiwhWrtnEV24PqTg9aWYkNmYx', '5KW5NRff8DwauDDJNZ3Jt1J4qWcCY94Pp6btRgbRKxdeNzKiLQH'],
        ['1Dm1yFR2AN64mrHi55659Rr75Cfrzqz942', '5JyoWwcmAxhf8Rk3anRXp2ExssWGrayCaBJG1VWYG5LRAncVjXX'],
        ['12pmbDL2CYqxScbH6EFmzjSosDdEapM9vc', '5JvGNCyKaz43SLE2dRc4UMiZJeN4qWdJVVjYG5T2ttvbGtJJe8B']
      ];

      keymaps.forEach((keymap) => {
        let wallet = new BchWallet({
          privateKey: keymap[1]
        });
        Assert.equal(wallet.getAddress(), keymap[0], `Address must be right. ${JSON.stringify(keymap)}`);
      });
    });
    it('PrivateKey.Testnet', async() => {
      const keymaps = [
        ['mxU6F5aBJTHy7eKhc5ML9uvvYa1kM5sKEJ', 'cSWNkEtBRuENC65quSNTRGa86SHWgZFdvSAXnUVBUttomy6SZv9r'],
        ['mpHMGw7sb15xZmm7pEthZ5En7rvrJEaemz', 'cTPYDFBog72ZaRvFrGos8krL2j7HepqDG3v5p6mPQWhjXPwem4Py'],
        ['mqra2EDqeLdM6G6K2TGC6Zu8WzRbm2g9mG', 'cSNDRe5nnCP516S2uB1dUmB157pgSxihu3feUugf7zexKsoVYo9H'],
        ['mxvK7yNHkmwTbk3uZHTtCmGXo3kL4jvojg', 'cPb2n1Ne7vW1umrdEngpgohSdMSooHsJ1NzV7VNAKdQWn6KYsHep'],
        ['n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F', 'cTSrt5Z2FToatbRMSqGGdgtmN1pRoeNPF6RSCzQd5Ta941osHcxd'],
      ];

      keymaps.forEach((keymap) => {
        let wallet = new BchWallet({
          privateKey: keymap[1],
          isTestNet: true
        });
        Assert.equal(wallet.getAddress(), keymap[0], `Address must be right. ${JSON.stringify(keymap)}`);
      });
    });
  });

  describe('#getBalance()', async() => {
    it('Mnemonic.Mainnet', async() => {
      let wallet = new BchWallet({
        mnemonic: ConfigTest.MNEMONIC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'Balance must be exist');
      Assert.ok(result.unconfirmed_balance !== undefined, 'Balance must be exist');
    });
    it('PrivateKey.Testnet', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: true
      });

      wallet.setApi(getApi(true));
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'Balance must be exist');
      Assert.ok(result.unconfirmed_balance !== undefined, 'Balance must be exist');
    });
  });

  describe('#getHistory()', async() => {
    it('default', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getHistory();
      Assert.ok(result.txs.length >= 0, 'History must be exist');
    });

    it('offset.limit', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getHistory(0, 1);
      Assert.ok(result.txs.length == 1, 'History must have one item');
    });

    it('offset = 50', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getHistory(50, 50);
      Assert.ok(result.txs.length == 0, 'History must be empty');
    });
  });

  describe('#getDefaultFee()', async() => {
    it('default', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee();
      Assert.ok(result > 0);
    });
    it('high', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('high');
      Assert.ok(result > 0);
    });
    it('medium', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('medium');
      Assert.ok(result > 0);
    });
    it('low', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('low');
      Assert.ok(result > 0);
    });
    it('error', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let api = wallet.getApi();
      api.BCH.getFeeRate = function() {
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
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({});
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter to');
      }
    });

    it('Missing parameter fee', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter fee or feeType');
      }
    });

    it('Invalid feeType', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
          feeType: 'InValid'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (feeType)');
      }
    });

    it('Invalid fee', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
          fee: 'InValid'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('fee = 0', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
          fee: 0
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('fee < 0', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
          fee: -1
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('default', async() => {

      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let listUnspent = [{
          'tx_id': '1e13afb2b3c1afcd7751298cd72af6d68a90eb1c018990f483f3f1bbf61c09e8',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 606,
          'amount': 9000
        }];
      let createResult = await wallet.createRawTx({
        to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
        fee: 5,
        amount: 1000,
        listUnspent
      });

      Assert.ok(createResult.fee > 0, 'Fee must be right');
      Assert.ok(createResult.raw.length > 0, 'Raw must be right');
    });

    it('feeType = high', async() => {

      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let listUnspent = [{
          'tx_id': '1e13afb2b3c1afcd7751298cd72af6d68a90eb1c018990f483f3f1bbf61c09e8',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 606,
          'amount': 9000
        }];
      let createResult = await wallet.createRawTx({
        to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
        feeType: 'high',
        amount: 1000,
        listUnspent
      });

      Assert.ok(createResult.fee > 0, 'Fee must be right');
      Assert.ok(createResult.raw.length > 0, 'Raw must be right');
    });

    it('OVER_BALANCE', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let createResult = await wallet.createRawTx({
        to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
        fee: 5,
        amount: 10000000
      });
      Assert.equal(createResult.error, 'OVER_BALANCE');
    });

    it('Fail to get utxo', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      let api = getApi(false);
      wallet.setApi(api);
      api.BCH.getUtxo = function() {
        return { cd: 1 };
      };
      try {
        await wallet.createRawTx({
          to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
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
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      let rawTx = '100000001e8091cf6bbf1f383f49089011ceb908ad6f62ad78c295177cdafc1b3b2af131e0000000000ffffffff02e8030000000000001976a914f65f9ef810028c9e642ed1f149a254fa020be86c88ac40130000000000001976a9146273d8f8c8c41f3980adbc15b7a5509eb38372d288ac00000000';
      try {
        await wallet.send({ rawTx });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.send_transaction_fail');
        Assert.ok(err.message.indexOf('TX decode failed') > 0);
      }
    });

    it('No rawTx & txParam', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
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
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      try {
        await wallet.send({
          txParams: {
            to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
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
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let sendResult = await wallet.send({
        txParams: {
          to: 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F',
          fee: 5,
          amount: 1000
        }
      });

      sendResult.should.have.property('tx_id');
      Assert.ok(sendResult.tx_id.length > 0);
    });

    it('do not broadcast', async() => {
      let wallet = new BchWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BCH,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      let rawTx = '0200000001da8c213e9cede4f75ad5c9023d7871781aa36102bf4bd12d59d004c26172c6cc000000006b483045022100ee0a66581681c105db89a89e0341e25b3708ffed3cd54a4fe7e51e4f4cc850280220741d37eea40c9064676cbb034611e36198f4281b2131f05984592cf2451225010121025cdbb5e871e74b2749388e1534f441d5d39a64bed8d1909315bde3bbee0cb138feffffff01e0a54b00000000001976a91441fd36eef3a1bcdb94dead1a24650d9e7f31e90a88ac00000000';
      let result = await wallet.send({ rawTx, isBroadCast: false });
      Assert.ok(result.raw.length > 0);
    });
  })
})
