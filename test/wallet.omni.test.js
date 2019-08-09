const Assert = require('assert');
const chai = require('chai');
const { InfinitoApi, OmniWallet } = require('../index');
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

describe.only('wallet.omni', async() => {

  describe('#constructor()', async() => {
    it('No Parameter', async() => {
      try {
        new OmniWallet({});
        Assert.fail();
      } catch (err) {
        Assert.equal(err.message, 'Missing required parameter options');
      }
    });
    it('Default cointype', async() => {
      let wallet = new OmniWallet({
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });
      Assert.equal('OMNI', wallet.account.coinType);
      Assert.equal('02c7f5bdda22d17bc8dd9b39e965b429885581c702ab260d2d950c74ecee399aa0', wallet.account.publicKey);
      Assert.equal('1HyESJs9yQNkNSxnsHXceEktB8TiYgaJu5', wallet.account.address);
    });
  });

  describe('#getAddress()', async() => {
    it('Mnemonic.Mainnet', async() => {
      let wallet = new OmniWallet({
        mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest',
        coinType: 'OMNI'
      });
      Assert.equal(wallet.getAddress(), '1KsRKC3ZK6ffL6roidjF2iqaa8EyCWgyDi', 'Address must be right');
    });
    it('Mnemonic.Testnet', async() => {
      let wallet = new OmniWallet({
        mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest',
        isTestNet: true
      });
      Assert.equal(wallet.getAddress(), '1Hx8x2VCVRriLXr5tWNxKzibgaR3UBhjLG', 'Address must be right');
    });
    it('PrivateKey.Mainnet', async() => {
      const keymaps = [
        ["m/44'/0'/0'/0/0", '1Fo5A2gdtaitDkmfb3jM2Tqrne3BaWoCpE', '02c611897cf87ce06c97ec6c7c0a1f5d8db294cb98fde5eda32d56c40960d28549', 'L44TYhcbK1VeyGNUaama4m3eHFD5hY9iHRRNDAALL8qdXfyfBDnS'],
        ["m/44'/0'/0'/0/1", '1Ky5rtnSV9wAB5GAShad9bgR7rZfX3B9Vt', '029091d69c87471760f7f2d82d3c65813170ac3642414c782d2e62945ebb72a817', 'L4si7B3FyNMt9DqGfsfYnNggPGGfWS328KkYPJDcaic2sB7FXhG1'],
        ["m/44'/0'/0'/0/2", '1A7ZCnDA8f8nXbP2UapCYybHJqVcRD8AG6', '03314f1e9a380cb6fc17301b41811574b45d7a579e9126182f4057e6f3df3d6078', 'KxMxAdQGZ6nwnoBotnFbcg1aCxiyX3yqucLqysL9YKPwqKxhEqRo'],
        ["m/44'/0'/0'/0/3", '1C7Q3xw7tnS6CWBxr2hiMkBATwLCjB5g8Q', '03efe751ba8dc56301fdf36c1317d361ad0905ca61ea73b0099b4502ebb35160ec', 'L4qz11TsK8E8kNEnCefYoppgiapiq1Zer5WfSTFJXFabty4NouNz'],
        ["m/44'/0'/0'/0/4", '1AZJuFzFVSLKQw7SDsSXS1fzdhWtyY6WH', '020d3a5145c2e6d6c62decfa225a75a60885cb75031e06ffffcb921b5a4085206c', 'KxzyBFHVogF3aRtXu9VuA7rW1hAC6ZMdYfSjvQuvkRPTzRgKJiEV'],
        ["m/44'/0'/0'/0/5", '1GZVtmGkKwtZhCPL4FbPBJB79imMWyz8H3', '031226c29a8e98fc50137e76e428975c2a037817617254bc38aff08a3464147ca7', 'KzrauviaHVRp6juvM4U4eHduVhLSmNeUyZy4mC84Q4g3dbqisU4W'],
        ["m/44'/0'/0'/0/6", '1N87Zyf21WDPSAiofEV5kv8MvawDcm8vCh', '03b5efe906b01642eff67fe63a624e01884974b65d94517242dfefae7b40cb857b', 'Kxewx6xC9of1tT4bz6Bsnc3pgVP47dfL5qXnZoMsvZMDW6AyPEx1'],
        ["m/44'/0'/0'/0/7", '1DFLj2ic9afQDcJ4vdidsfANTazYJe6enF', '0378ed72b83d1d78faafe359195d47edd6f4b35bf11994fe56b0cb8522e3a38fdb', 'KxjZ7NjMaUTkfAhxShUXqJdCWZ3D1E9X3R5Ys33D3ZMFWZ9UQw2M'],
        ["m/44'/0'/0'/0/8", '1C9owULYisAw8eZCBYHVdv7u3FWefpPDSg', '0396da50aa071333769aefad435248de8e09af4d407fb492eb8570e69ffc335b71', 'L5ZHJPMjMcqwkQ2aKW6ukdeptFLqdqRkvWJHWVRR7CsSKBBJurHy'],
        ["m/44'/0'/0'/0/9", '16nRUgFuLpMHsnXb29qwpqvrex9ydn9keK', '0387e2e13a78300da20eafac90b36fb4b4f28388404fa67355e886429629dadfeb', 'Kzj2UnHs15UUXfxwoUkYgZ6jWwwrfS9c1EogEUh6Q9rQoKLUrif7'],
        ["m/44'/0'/0'/0/10", '1HhV42RnB3HdsExkQEBkxTpDMPs2R6LRyV', '02ab77ecd3fc6185d2685775df0a381898b9b5b538bea4bf2359a837752bba76fb', 'KwSYW1xuevgqiYJVDGunaRNc8k519E9DhNccgiKwBT4vU4VMw2JF'],
        ["m/44'/0'/0'/0/11", '1QC5PYvzNg9HruFcdJL8FxJjF5wapZDRcB', '028f48617671615b779fc126a596da2f58547c66c4f7b45632f2710f1b45581a47', 'L3TSxaKimLeMXC2QNwD458zPHpnQGpadSFk7UKrKKnqZwmWbLVpf'],
        ["m/44'/0'/0'/0/12", '1FRF7SfWrYRJ7zAr5Y9vqLDTFB2nf2ueBa', '02d99f574b557c75c2036d296c6f8d1b3bb7df48577eec46ed271400c3b3f92af8', 'L34YBLM92ye7K9HPrWwWr48Qcvkc4eAKbsEQQTP84vgDR4QvXnPk'],
        ["m/44'/0'/0'/0/13", '18uTGcK4bSxb5pZK67yEkqwyQJPY1axmXB', '032e16ea175e2a64206c3d8e94c94bafcbc84368615e638631a5fb2295717664a7', 'KxhPCCWJMpsKCraFPGKdYzR8C6csF3LxJVSCNYMiRCkMmGcRutSF'],
        ["m/44'/0'/0'/0/14", '1FhJFyvzMCCSaHQcWQE2wuxDERzd3j5rbU', '02871f12aef24e21c39e41a10810445159f755b848b8ab0f59dd514c58538e1a26', 'L3HcE37CDkJ22RkmwEWJCgaLCBEaCV87HATTipLLaNudjEJEqauv'],
        ["m/44'/0'/0'/0/15", '18N3EDLuVwRTcsucVqWewVWNuvtMzLrcZ2', '03bbdabbf30cd4b918ce4dcd2d95ec0918f84b36ae164b12d98331d55560e19563', 'Ky3bAD8zrWGLk3E9oWPHeMzdBsUXP9CHtioqoXzUjFMmm7Zny6NR'],
        ["m/44'/0'/0'/0/16", '1HSaxpvQS58auZSjTSnZx31QANq5JsbFPA', '03d7be2019fce53483f92f836bbd84520bce85030bffec61e487cf55f9e866769c', 'KzZhPaCdUF4xqQzEAJHzmXdvcPLQruPzgvaxnNswZ8FAsmvQAVkS'],
        ["m/44'/0'/0'/0/17", '1Gc2QfgshzWHfmFvKUZcbaW3zdCXp3yZii', '02afad2684003ae2e9ffab362661c2c405fa49245cafbbf3dc6b4126e87715cecc', 'L3fJuDNqZGCiNmCRimhxHp2wSuLG8AnpzMPngjrjTQreEjMQRMYS'],
        ["m/44'/0'/0'/0/18", '1L3x2me6s6ujNWSHQdPKSVUk976Qz8w3NN', '029c24c2c009242c44446e34307efb2d14bd057c8890f751732b98bc6fe91f1004', 'Ky1H4xXPbVw45JNZzHPg6RzMZCMCFa8ZXo52De2XUUHLZZVopduv'],
        ["m/44'/0'/0'/0/19", '16ki1UfDm4R98CjNDPsWYJX2egLMmyEx8h', '030bab709d0b1e8ce792c7a9d1b56f3ff283dac3817fea23deb58b9365a4a066c0', 'L4PmGZHjCsNn5WPQzzSe6yKhtTdvfjYh1eiukhgtba5EWZKcCZkP']
      ];

      keymaps.forEach((keymap) => {
        let wallet = new OmniWallet({
          privateKey: keymap[3]
        });
        Assert.equal(wallet.getAddress(), keymap[1], `Address must be right. ${JSON.stringify(keymap)}`);
      });
    });
  });

  describe('#getBalance()', async() => {
    it('Mnemonic.Mainnet', async() => {
      let wallet = new OmniWallet({
        mnemonic: ConfigTest.MNEMONIC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'Balance must be exist');
      Assert.ok(result.reserved !== undefined, 'Reserved must be exist');
    });
  });

  describe('#getDefaultFee()', async() => {
    it('default', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee();
      Assert.ok(result > 0);
    });
    it('high', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('high');
      Assert.ok(result > 0);
    });
    it('medium', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('medium');
      Assert.ok(result > 0);
    });
    it('low', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getDefaultFee('low');
      Assert.ok(result > 0);
    });
  });

  describe('#createRawTx()', async() => {
    it('success', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let createResult = await wallet.createRawTx({
        to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
        amount: 0.05,
        feeType: 'low'
      });

      console.log(createResult);
      Assert.equal(createResult.tx_id, 'd5611f062da9db21d19c5093bfc208be06e0150454c98d2dd0c208696e926222', 'TxId must be right');
      Assert.equal(createResult.raw,'020000000170109a0428b0d8ebe1122fa9cc087ca1bb5a2bae518bd082b7a2842a5b107259020000006a47304402205157105ab8c79fa84f73477551ecd57f136dbd56fa888a1ea81753542465e9360220153bd7438dba61ef2926c335aa0f59d0920b71c73b6644fe1fad263df80bb07c012103c6bac7b87c7492de09ce9fe018cdf83869edee75c3c094a48253fd561ff4ee11ffffffff0322020000000000001976a91436ae029666de9cdb898a0dc2021560202a40208788ac0000000000000000166a146f6d6e69000000000000001f00000000004c4b4062920000000000001976a91477ca3f8ac9ca59296db880b7bddf932b57b65f8c88ac00000000', 'Raw must be right');
    });
    it('Missing parameter to', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
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
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter fee or feeType');
      }
    });

    it('Invalid feeType', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
          feeType: 'InValid'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (feeType)');
      }
    });

    it('Invalid fee', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
          fee: 'InValid'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('fee = 0', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
          fee: 0
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('fee < 0', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });

      try {
        await wallet.createRawTx({
          to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
          fee: -1
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('feeType = high', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let listUnspent = [{
          'tx_id': '1e13afb2b3c1afcd7751298cd72af6d68a90eb1c018990f483f3f1bbf61c09e8',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 606,
          'amount': 9000
        },
        {
          'tx_id': '091482cc897b046432cb281d501b295b5783844dbe1d029b00bcd7dd8a6723b1',
          'vout': 1,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 606,
          'amount': 13561553
        },
        {
          'tx_id': '091482cc897b046432cb281d501b295b5783844dbe1d029b00bcd7dd8a6723b1',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 606,
          'amount': 9000
        },
        {
          'tx_id': 'becdfbfc0eb70a774b8683ca892945a435b212c2cdb0e439e87297f7c05838fc',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 607,
          'amount': 9000
        },
        {
          'tx_id': '9b27248ac64e3c6660c1d70d81d0a26175455576c536ab54848eaed6d8ab0fee',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 607,
          'amount': 90000
        },
        {
          'tx_id': '801b0988e7640da2e7b1aa6b0fa40464cdff36e62b6ff69909033df23045cce4',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 607,
          'amount': 9000
        },
        {
          'tx_id': 'bd94c82ab71e6ff048f14ea3ad2987a3e2a82783023cec8286700784ba0abf92',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 607,
          'amount': 9000
        },
        {
          'tx_id': '3a61b698794965ce259fe1a7fabd273a2673576ea5609631d1f30743e14c8c92',
          'vout': 0,
          'scriptpubkey': '76a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac',
          'confirmations': 607,
          'amount': 9000
        }
      ];
      let createResult = await wallet.createRawTx({
        to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
        feeType: 'high',
        amount: 1000,
        listUnspent
      });

      Assert.ok(createResult.tx_id.length > 0, 'TxId must be exist');
      Assert.ok(createResult.raw.length > 0, 'Raw must be exist');
    });

    it('OVER_BALANCE', async() => {

      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let createResult = await wallet.createRawTx({
        to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
        fee: 5,
        amount: 100000
      });
      Assert.equal(createResult.error, 'OVER_BALANCE');
    });

    it('Fail to get utxo', async() => {

      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      let api = getApi(false);
      wallet.setApi(api);
      api.BTC.getUtxo = function() {
        return { cd: 1 };
      };
      try {
        await wallet.createRawTx({
          to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
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
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      let rawTx = '0200000001b123678addd7bc009b021dbe4d8483575b291b501d28cb3264047b89cc821409010000006b483045022100a57dc41223b49c02b1f3c4928a88efcffba3830ecf23b8283475c5c7515136ee0220536c793fefba1eed712bb8ce2e43c1176b355e3549545eb62540c3d5ebd2e7c6012102b17748b9f836cbc8932b0c2eff3c30e1c4d268c2c3b102272ecdeb1b36fb6eddffffffff02e8030000000000001976a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac84e6ce00000000001976a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac00000000';
      try {
        await wallet.send({ rawTx });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.send_transaction_fail');
        Assert.ok(err.message.indexOf('Error validating transaction') > 0);
      }
    });

    it('No rawTx & txParam', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
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

      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      try {
        await wallet.send({
          txParams: {
            to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
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

    it('send old raw transaction', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      let rawTx = '0200000001da8c213e9cede4f75ad5c9023d7871781aa36102bf4bd12d59d004c26172c6cc000000006b483045022100ee0a66581681c105db89a89e0341e25b3708ffed3cd54a4fe7e51e4f4cc850280220741d37eea40c9064676cbb034611e36198f4281b2131f05984592cf2451225010121025cdbb5e871e74b2749388e1534f441d5d39a64bed8d1909315bde3bbee0cb138feffffff01e0a54b00000000001976a91441fd36eef3a1bcdb94dead1a24650d9e7f31e90a88ac00000000';
      try {
        await wallet.send({ rawTx });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.send_transaction_fail');
        Assert.ok(err.message.indexOf('Error validating transaction') > 0);
      }
    });

    it('broadcast with custom fee', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let sendResult = await wallet.send({
        txParams: {
          to: '15z7wnzt3tja6tTQWxuvLSJ4NYbvbWMvyX',
          fee: 5,
          amount: 1000
        }
      });

      sendResult.should.have.property('tx_id');
      Assert.ok(sendResult.tx_id.length > 0);
    });

    it('do not broadcast', async() => {
      let wallet = new OmniWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      let rawTx = '0200000001da8c213e9cede4f75ad5c9023d7871781aa36102bf4bd12d59d004c26172c6cc000000006b483045022100ee0a66581681c105db89a89e0341e25b3708ffed3cd54a4fe7e51e4f4cc850280220741d37eea40c9064676cbb034611e36198f4281b2131f05984592cf2451225010121025cdbb5e871e74b2749388e1534f441d5d39a64bed8d1909315bde3bbee0cb138feffffff01e0a54b00000000001976a91441fd36eef3a1bcdb94dead1a24650d9e7f31e90a88ac00000000';
      let result = await wallet.send({ rawTx, isBroadCast: false });

      Assert.ok(result.raw.length > 0);
    });

    it('dust transaction', async() => {
      let wallet = new OmniWallet({
        mnemonic: ConfigTest.MNEMONIC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));

      try {
        await wallet.send({
          txParams: {
            to: '1HBEeujr42YiQ4bF4fu4oyg7FjfgsazbVb',
            fee: 1,
            amount: 1
          },
          isBroadCast: true
        });
      } catch (err) {
        console.log('err :', err);
        Assert.equal(err.code, 'infinito.wallet.send_transaction_fail');
        Assert.ok(err.message.indexOf('dust') >= 0);
      }
    });
  });

});
