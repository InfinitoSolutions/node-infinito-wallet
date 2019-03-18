const Assert = require('assert');
const chai = require('chai');
const { InfinitoApi, BtcWallet } = require('../index');
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

describe('wallet.btc', async() => {

  describe('#constructor()', async() => {
    it('No Parameter', async() => {
      try {
        new BtcWallet();
        Assert.fail();
      } catch (err) {
        Assert.equal(err.message, 'Missing required parameter options');
      }
    });
    it('Default cointype', async() => {
      let wallet = new BtcWallet({
        mnemonic: 'still okay stairs fruit pizza mushroom eye cradle seven speak sudden motion'
      });
      Assert.equal('BTC', wallet.account.coinType);
      Assert.equal('0369b312c3666b71549b558b177d6b1437b16d08ced358e482279dfc1ccabfa2a1', wallet.account.publicKey);
      Assert.equal('14o48GBMj6BKJ7AefdWkUDf9R6Ga5GvjY1', wallet.account.address);
    });
  });

  describe('#getAddress()', async() => {
    it('Mnemonic.Mainnet', async() => {
      let wallet = new BtcWallet({
        mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest',
        coinType: 'BTC'
      });
      Assert.equal(wallet.getAddress(), '1Fo5A2gdtaitDkmfb3jM2Tqrne3BaWoCpE', 'Address must be right');
    });
    it('Mnemonic.Testnet', async() => {
      let wallet = new BtcWallet({
        mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest',
        isTestNet: true
      });
      Assert.equal(wallet.getAddress(), 'mxU6F5aBJTHy7eKhc5ML9uvvYa1kM5sKEJ', 'Address must be right');
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
        let wallet = new BtcWallet({
          privateKey: keymap[3]
        });
        Assert.equal(wallet.getAddress(), keymap[1], `Address must be right. ${JSON.stringify(keymap)}`);
      });
    });
    it('PrivateKey.Testnet', async() => {
      const keymaps = [
        ["m/44'/1'/0'/0/0", 'mxU6F5aBJTHy7eKhc5ML9uvvYa1kM5sKEJ', '020a347b5c708c2b2b764c1956132af6a886980a6a80e7ca6045bb25f7aa1accb8', 'cSWNkEtBRuENC65quSNTRGa86SHWgZFdvSAXnUVBUttomy6SZv9r'],
        ["m/44'/1'/0'/0/1", 'mpHMGw7sb15xZmm7pEthZ5En7rvrJEaemz', '0307663d2e41b7bd748560637e3dbc147e223f461b8fdf97128ef37952d56e3032', 'cTPYDFBog72ZaRvFrGos8krL2j7HepqDG3v5p6mPQWhjXPwem4Py'],
        ["m/44'/1'/0'/0/2", 'mqra2EDqeLdM6G6K2TGC6Zu8WzRbm2g9mG', '031ffa6f8e548dc96eb08ca11924c400e597d3bbfa88525f6b668c3094f6b543ba', 'cSNDRe5nnCP516S2uB1dUmB157pgSxihu3feUugf7zexKsoVYo9H'],
        ["m/44'/1'/0'/0/3", 'mxvK7yNHkmwTbk3uZHTtCmGXo3kL4jvojg', '036995d8af6f61002d4916f6cf2074863a5bc5410eac335e1889a5ff9b411bbbb5', 'cPb2n1Ne7vW1umrdEngpgohSdMSooHsJ1NzV7VNAKdQWn6KYsHep'],
        ["m/44'/1'/0'/0/4", 'n3yf576hFrmJyp97X5vdhpsyYWRhKs9V5F', '02dece4bd0a6643b08282c760bdfad5af3690ffea847deeee0205d3c8d1760d83f', 'cTSrt5Z2FToatbRMSqGGdgtmN1pRoeNPF6RSCzQd5Ta941osHcxd'],
        ["m/44'/1'/0'/0/5", 'mofVeaZ8GSFNLGd4nkmiRnYB59Thi8m44x', '02cf507419ce685a2dd07fd7a8928d66a505454e32555e959b001671e8667fcd75', 'cNnphbHcoypVsupWENmmvrpdd4YPKKf3LBrFBoXE4UPbTBR3oXdY'],
        ["m/44'/1'/0'/0/6", 'mtNqPHQbWJkzTSxjV65HEABcwWFPdjRYKv', '03af1f44c50c4b30fad641113aff7634e2c23bcf3ca0808fa6f628f09b1356eaf6', 'cPJASeTZ3boZajBkBL7es7GqS83WSiWUndiKpgtUA6bwVhAakiJY'],
        ["m/44'/1'/0'/0/7", 'mpko4PUiHmLNBnpt8Pi7k56QAeHzE9LcYC', '033364a2a0041001f255fa7f60411b47037088c3df2a6d539608fcf58de8e35a9b', 'cVBUZBnBsFzryfvi6nfT7TZa3JHLDbv1YjKKzdztThUaoC6jTqBg'],
        ["m/44'/1'/0'/0/8", 'n4A1NREYuuRDeoL8qpy3VR2aocdBcZXAW5', '0353fe67bfb069f74edd5c7e34adc0d4813b4c19dcdc3051689f343c4e733b2053', 'cVQ1H8wBkYAThrMWA1aX3HhBj8qRL8XsWKj12m6agw7uzcHwqcwi'],
        ["m/44'/1'/0'/0/9", 'mrnjVFsjveBEgiJgwmn1hXvR27FwCQbSbY', '031669b394585be77a28ab5064b9008b688849149fa3a068589542f277796caa5c', 'cU2TfeZzmbxcr7A2x8BZ1aP9WNCVDDMEKw48A9SEsVoaiCxXxyc5'],
        ["m/44'/1'/0'/0/10", 'mwjU4LN5h4qaeR8XPQkAmzFrPug3sscZne', '03b8151acad3bffc4a2061410198cf5405f8f13617ee16d101e82a113f69939613', 'cVt5VKN28UUB5KhSCtHGCcMWeGAeBP7ZTDyyBLT69YvFjP5bRQh6'],
        ["m/44'/1'/0'/0/11", 'n37CWQkHyZrWTcvYjXexa9yEsZQufJfC9T', '03cc28deded34ab4ff75d899995bafa4ea7c886ef6aa1c50679927e77a04d40a4d', 'cPVa8xmXqYwatjvbJzHXYdzmAkH12MKRVCE8zG7jMAawaeuA4Ujw'],
        ["m/44'/1'/0'/0/12", 'mrZ8getpxxgk8mKmiSCRQSaqzLw6PRERYT', '03ee2c6c96a1838e37bbe5e341dd237e1b8c6bcf7e18674f371ecd731317f611f7', 'cPLDYLGG2h1fn7p5fJEHo64MHv8LsbPEns9gf4chjTMvHf72tctB'],
        ["m/44'/1'/0'/0/13", 'mzPiJJ1c5TqUNLuSiHUcRUZerhLJZraXBA', '0302d7380afaa3bb063bddcb537ab56a494d988d2260e08a78daaea7fb09756e2e', 'cTE8WAVj19rFZiA2VmozFdeQWACCtSCzknmeTeTaEzuDUwj7Uk1u'],
        ["m/44'/1'/0'/0/14", 'mz87nPZwBzfXMij76d5K5euPMoGNUgYR4o', '028570095c97181ad324b843ee4cecc84fbfd59f864a159187ab1d8f2c3dabfd53', 'cSa7b5LaQUCreAUbdSWCyDAR1Lk7BKbZhZ36hmuPy4v3ASqpBCLg'],
        ["m/44'/1'/0'/0/15", 'n3sWBkxtjwe5WiTGwHiiLr89aBtL4g5AJx', '0206a80dc40a756c9210d805b2bdeaee91be48c59ab2594043eafab2aa9bc29171', 'cTz27dkg3LVzGuofSDs1WUZci9ZzdRxwThujn26Xytn2WwUSVJgD'],
        ["m/44'/1'/0'/0/16", 'mm9usDmEUu4hULYoFmFw51PQyqCsmT5zdD', '03a04211207efbde53f7cf44810164d1bdcd365cb3af79be22a6ba55fb6cd95115', 'cVXSBMWAuDUiYqLgkUbuereAXchhUoYp6wL22uiCyrFEth5kzZZG'],
        ["m/44'/1'/0'/0/17", 'mfpNayZNkEbeRc16tPXpeUKJxu2R6HY1VJ', '0322c5afee83d1ac61e11c637a60b478f2d2e1824a5ea48e186f26651b7786e0c5', 'cSZ9N2ZT9KJEf8QfyYpQRg1Ek6SuU6Ck1vGQRegGeWFcMJXPcHK1'],
        ["m/44'/1'/0'/0/18", 'miGWmarVK4J4RbcrNnLJBsvhttk3QmjSwD', '0202202cf7d5d8cd1a9e947a100076014291f22342a6868b8eeeff346160cf69f2', 'cR9BGgdqEF2Ga7eBJ7Fkp4J1EZHyWrue6X1ARbQAR3hKNFy9rU13'],
        ["m/44'/1'/0'/0/19", 'mwgLGiRLDXSXxHZMDYDGJZhG83MbXEmqcX', '02cc25df7d668c25bbb903a802a982e917286b35f19a1f203ec04a50479f7ffa30', 'cVAPkRjmaV2ZtQRgGkLVKDj27jB7ftFJyUHsy7tAdC4yawqm5Aqu'],
      ];

      keymaps.forEach((keymap) => {
        let wallet = new BtcWallet({
          privateKey: keymap[3],
          isTestNet: true
        });
        Assert.equal(wallet.getAddress(), keymap[1], `Address must be right. ${JSON.stringify(keymap)}`);
      });
    });
  });

  describe('#getBalance()', async() => {
    it('Mnemonic.Mainnet', async() => {
      let wallet = new BtcWallet({
        mnemonic: ConfigTest.MNEMONIC,
        isTestNet: false
      });
      wallet.setApi(getApi(false));
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'Balance must be exist');
      Assert.ok(result.unconfirmed_balance !== undefined, 'Balance must be exist');
    });
    it('PrivateKey.Testnet', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
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
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getHistory();
      Assert.ok(result.txs.length > 0, 'History must be exist');
    });

    it('offset = 1', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getHistory(1);
      Assert.ok(result.txs.length > 0, 'History must be exist');
    });

    it('offset = 10000', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getHistory(10000);
      Assert.ok(result.txs.length == 0, 'History must be empty');
    });

    it('offset.limit', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getHistory(1, 1);
      Assert.ok(result.txs.length == 1, 'History must have one item');
    });
  });

  describe('#getDefaultFee()', async() => {
    it('default', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getDefaultFee();
      Assert.ok(result > 0);
    });
    it('high', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getDefaultFee('high');
      Assert.ok(result > 0);
    });
    it('medium', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getDefaultFee('medium');
      Assert.ok(result > 0);
    });
    it('low', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let result = await wallet.getDefaultFee('low');
      Assert.ok(result > 0);
    });
    it('error', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let api = wallet.getApi();
      api.BTC.getFeeRate = function() {
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
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
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
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter fee or feeType');
      }
    });

    it('Invalid feeType', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
          feeType: 'InValid'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (feeType)');
      }
    });

    it('Invalid fee', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
          fee: 'InValid'
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('fee = 0', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
          fee: 0
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('fee < 0', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });

      try {
        await wallet.createRawTx({
          to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
          fee: -1
        });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (fee)');
      }
    });

    it('default', async() => {

      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
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
        to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
        fee: 5,
        amount: 1000,
        listUnspent
      });

      Assert.equal(createResult.tx_id, 'a8a88d07385f83dbf84ff6b3801c7acb8c52027cccd36c8369f97742143ece49', 'TxId must be right');
      Assert.equal(createResult.raw, '0200000001b123678addd7bc009b021dbe4d8483575b291b501d28cb3264047b89cc821409010000006b483045022100a57dc41223b49c02b1f3c4928a88efcffba3830ecf23b8283475c5c7515136ee0220536c793fefba1eed712bb8ce2e43c1176b355e3549545eb62540c3d5ebd2e7c6012102b17748b9f836cbc8932b0c2eff3c30e1c4d268c2c3b102272ecdeb1b36fb6eddffffffff02e8030000000000001976a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac84e6ce00000000001976a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac00000000', 'Raw must be right');
    });

    it('feeType = high', async() => {

      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
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
        to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
        feeType: 'high',
        amount: 1000,
        listUnspent
      });

      Assert.ok(createResult.tx_id.length > 0, 'TxId must be exist');
      Assert.ok(createResult.raw.length > 0, 'Raw must be exist');
    });

    it('OVER_BALANCE', async() => {

      let wallet = new BtcWallet({
        privateKey: 'cTXN3Bhfz12HNX2jpA4DUhkk2FnoAXbyYvSqkCDkDRLBJzBCW9wj',
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let createResult = await wallet.createRawTx({
        to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
        fee: 5,
        amount: 100000
      });
      Assert.equal(createResult.error, 'OVER_BALANCE');
    });

    it('Fail to get utxo', async() => {

      let wallet = new BtcWallet({
        privateKey: 'cTXN3Bhfz12HNX2jpA4DUhkk2FnoAXbyYvSqkCDkDRLBJzBCW9wj',
        isTestNet: true
      });
      let api = getApi(true);
      wallet.setApi(api);
      api.BTC.getUtxo = function() {
        return { cd: 1 };
      };
      try {
        await wallet.createRawTx({
          to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
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
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));

      let rawTx = '0200000001b123678addd7bc009b021dbe4d8483575b291b501d28cb3264047b89cc821409010000006b483045022100a57dc41223b49c02b1f3c4928a88efcffba3830ecf23b8283475c5c7515136ee0220536c793fefba1eed712bb8ce2e43c1176b355e3549545eb62540c3d5ebd2e7c6012102b17748b9f836cbc8932b0c2eff3c30e1c4d268c2c3b102272ecdeb1b36fb6eddffffffff02e8030000000000001976a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac84e6ce00000000001976a914cb6fdab1832fc8be8eef0a0f11c12e53563e4c4688ac00000000';
      try {
        await wallet.send({ rawTx });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.send_transaction_fail');
        Assert.ok(err.message.indexOf('Error validating transaction') > 0);
      }
    });

    it('No rawTx & txParam', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));

      try {
        await wallet.send({});
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter rawTx or txParams');
      }
    });

    it('fail to create raw', async() => {

      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      try {
        await wallet.send({
          txParams: {
            to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
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
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));

      let rawTx = '0200000001da8c213e9cede4f75ad5c9023d7871781aa36102bf4bd12d59d004c26172c6cc000000006b483045022100ee0a66581681c105db89a89e0341e25b3708ffed3cd54a4fe7e51e4f4cc850280220741d37eea40c9064676cbb034611e36198f4281b2131f05984592cf2451225010121025cdbb5e871e74b2749388e1534f441d5d39a64bed8d1909315bde3bbee0cb138feffffff01e0a54b00000000001976a91441fd36eef3a1bcdb94dead1a24650d9e7f31e90a88ac00000000';
      try {
        await wallet.send({ rawTx });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.send_transaction_fail');
        Assert.ok(err.message.indexOf('Error validating transaction') > 0);
      }
    });

    it('broadcast with custom fee', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));
      let sendResult = await wallet.send({
        txParams: {
          to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
          fee: 5,
          amount: 1000
        }
      });

      sendResult.should.have.property('tx_id');
      Assert.ok(sendResult.tx_id.length > 0);
    });

    it('do not broadcast', async() => {
      let wallet = new BtcWallet({
        privateKey: ConfigTest.PRIVATE_KEY_BTC,
        isTestNet: true
      });
      wallet.setApi(getApi(true));

      let rawTx = '0200000001da8c213e9cede4f75ad5c9023d7871781aa36102bf4bd12d59d004c26172c6cc000000006b483045022100ee0a66581681c105db89a89e0341e25b3708ffed3cd54a4fe7e51e4f4cc850280220741d37eea40c9064676cbb034611e36198f4281b2131f05984592cf2451225010121025cdbb5e871e74b2749388e1534f441d5d39a64bed8d1909315bde3bbee0cb138feffffff01e0a54b00000000001976a91441fd36eef3a1bcdb94dead1a24650d9e7f31e90a88ac00000000';
      let result = await wallet.send({ rawTx, isBroadCast: false });

      Assert.ok(result.raw.length > 0);
    });

    it('dust transaction', async() => {
      let wallet = new BtcWallet({
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
        Assert.equal(err.code, 'infinito.wallet.send_transaction_fail');
        Assert.ok(err.message.indexOf('dust') >= 0);
      }
    });
  });

});