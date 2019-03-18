const Assert = require('assert');
const chai = require('chai');
const HDNode = require('../lib/hdnode');
const BIP44 = require('../lib/bip44');
const CoinType = require('../lib/coin_type');
chai.should();

var hdNode;

// function printHDNodeInfo(hdnode) {
//   console.log('hdnode : ');
//   console.log(' - .hdPath : ', hdnode.getHDPath());
//   console.log(' - .wif : ', hdnode.getWif());
//   console.log(' - .publicKey : ', hdnode.getPublicKey());
//   console.log(' - .privateKey : ', hdnode.getPrivateKey());
//   console.log(' - .mnemonic : ', hdnode.getMnemonic());
// }

// function printKeyPair(keypair) {
//   console.log('hdnode : ', keypair);
//   console.log(' - .wif : ', keypair.toWIF());
//   console.log(' - .publicKey : ', keypair.publicKey.toString('hex'));
//   console.log(' - .privateKey : ', keypair.privateKey.toString('hex'));
// }

describe('hdnode', async() => {

  describe('#constructor', async => {
    it('no parameter', async() => {
      try {
        new HDNode();
        Assert.fail();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter hdPath');
      }
    });
    it('testnet', async() => {
      let hdnode = new HDNode({ isTestnet: true });
      Assert.equal(hdnode.hdPath, "m/44'/1'/0'/0/0", "Must be hdpath of testnet");
      Assert.equal(hdnode.mnemonic.split(" ").length, 12, "Must be 12 words passphrase");
      Assert.equal(hdnode.hdPathArr.length, 6);
    });
    it('testnet with passphrase', async() => {
      let mnemonic = HDNode.generateMnemonic();
      let hdnode = new HDNode({ mnemonic, isTestnet: true });
      Assert.equal(hdnode.hdPath, "m/44'/1'/0'/0/0");
      Assert.equal(hdnode.mnemonic, mnemonic);
      Assert.equal(hdnode.hdPathArr.length, 6);
    });

    it('BTC', async() => {
      let hdnode = new HDNode({ hdPath: "m/44'/0'/0'/0/0" });
      Assert.equal(hdnode.hdPath, "m/44'/0'/0'/0/0");
      Assert.equal(hdnode.mnemonic.split(" ").length, 12, "Must be 12 words passphrase");
      Assert.equal(hdnode.hdPathArr.length, 6);
    });

    it('Invalid hdpath', async() => {
      try {
        new HDNode({ hdPath: "m/44'/0'/0'/0" });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_hdpath');
        Assert.equal(err.message, `Invalid hdpath m/44'/0'/0'/0`);
      }

      try {
        new HDNode({ hdPath: "m/44'/0'/0'/0/0/1" });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_hdpath');
        Assert.equal(err.message, `Invalid hdpath m/44'/0'/0'/0/0/1`);
      }

      try {
        new HDNode({ hdPath: "Invalid" });
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_hdpath');
        Assert.equal(err.message, `Invalid hdpath Invalid`);
      }
    });
  });

  describe('#getHdPathByCoinType', async => {
    it('Invalid', async() => {
      try {
        HDNode.getHdPathByCoinType("Invalid");
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_cointype');
        Assert.equal(err.message, 'Invalid coin type INVALID');
      }
    });
    it('Testnet', async() => {
      let result = HDNode.getHdPathByCoinType("TESTNET");
      Assert.equal(result, "m/44'/1'/0'/0/0");
    });
    it('BTC', async() => {
      let result = HDNode.getHdPathByCoinType("BTC");
      Assert.equal(result, "m/44'/0'/0'/0/0");
    });
    it('BCH', async() => {
      let result = HDNode.getHdPathByCoinType("BCH");
      Assert.equal(result, "m/44'/145'/0'/0/0");
    });
    it('LTC', async() => {
      let result = HDNode.getHdPathByCoinType("LTC");
      Assert.equal(result, "m/44'/2'/0'/0/0");
    });
    it('DOGE', async() => {
      let result = HDNode.getHdPathByCoinType("DOGE");
      Assert.equal(result, "m/44'/3'/0'/0/0");
    });
    it('DASH', async() => {
      let result = HDNode.getHdPathByCoinType("DASH");
      Assert.equal(result, "m/44'/5'/0'/0/0");
    });
    it('NEO', async() => {
      let result = HDNode.getHdPathByCoinType("NEO");
      Assert.equal(result, "m/44'/888'/0'/0/0");
    });
    it('ETH', async() => {
      let result = HDNode.getHdPathByCoinType("ETH");
      Assert.equal(result, "m/44'/60'/0'/0/0");
    });
    it('ETC', async() => {
      let result = HDNode.getHdPathByCoinType("ETC");
      Assert.equal(result, "m/44'/61'/0'/0/0");
    });
    it('ADA', async() => {
      let result = HDNode.getHdPathByCoinType("ADA");
      Assert.equal(result, "m/44'/1815'/0'/0/0");
    });
    it('EOS', async() => {
      let result = HDNode.getHdPathByCoinType("EOS");
      Assert.equal(result, "m/44'/194'/0'/0/0");
    });
    it('ONT', async() => {
      let result = HDNode.getHdPathByCoinType("ONT");
      Assert.equal(result, "m/44'/1024'/0'/0/0");
    });
  });

  describe('#generateKeyPair()', async() => {
    it('Generated passphase', async() => {
      hdNode = new HDNode({ hdPath: "m/44'/1'/0'/0/0" });
      hdNode.generateKeyPair('BTC', 0);
      Assert.equal(hdNode.getHDPath(), "m/44'/1'/0'/0/0", 'HDPath must be valid');
      Assert.ok(hdNode.getWif().length > 0, 'Wif must be exist');
      Assert.ok(hdNode.getPrivateKey().toString('hex').length > 0, 'Private key must be exist');
      Assert.ok(hdNode.getPublicKey().toString('hex').length > 0, 'Public key must be exist');
    });
    it('index < 0', async() => {
      hdNode = new HDNode({ hdPath: "m/44'/1'/0'/0/0" });
      try {
        hdNode.generateKeyPair('BTC', -1);
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.invalid_parameter');
        Assert.equal(err.message, 'Parameter is invalid. (index)');
      }
    });
  });

  describe('#getHDPath()', async() => {
    it('Pass parameter', async() => {
      hdNode = new HDNode({ hdPath: "m/44'/0'/0'/0/0" });
      let hdpath = hdNode.getHDPath();
      Assert.equal(hdpath, "m/44'/0'/0'/0/0", 'Must be equal parameter');
    });
  });

  describe('#getWif() getPublicKey() getPrivateKey()', async() => {
    it('BTC', async() => {
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


      let index = 0;
      keymaps.forEach((keymap) => {
        hdNode = new HDNode({ hdPath: keymap[0], mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest' });
        hdNode.generateKeyPair('BTC', index);
        Assert.equal(hdNode.getHDPath(), keymap[0], `HdPath must be equal. ${keymap[0]} - Index: ${index}`);
        Assert.equal(hdNode.getWif(), keymap[3], `Wif must be equal. ${keymap[0]} - Index: ${index}`);
        Assert.equal(hdNode.getPublicKey().toString('hex'), keymap[2], `Public key must be equal. ${keymap[0]} - Index: ${index}`);
        index++;
      });

    });
    it('Testnet', async() => {
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

      let index = 0;
      keymaps.forEach((keymap) => {
        hdNode = new HDNode({ mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest', isTestnet: true });
        hdNode.generateKeyPair('BTC', index);
        Assert.equal(hdNode.getHDPath(), keymap[0], `HdPath must be equal. ${keymap[0]} - Index: ${index}`);
        Assert.equal(hdNode.getWif(), keymap[3], `Wif must be equal. ${keymap[0]} - Index: ${index}`);
        Assert.equal(hdNode.getPublicKey().toString('hex'), keymap[2], `Public key must be equal. ${keymap[0]} - Index: ${index}`);
        index++;
      });

    });
  });

  describe('#getMnemonic()', async() => {
    it('Pass parameter', async() => {
      hdNode = new HDNode({ mnemonic: 'toss true onion like penalty spot cloth need disease start coyote suggest', isTestnet: true });
      let mnemonic = hdNode.getMnemonic();
      console.log('mnemonic', mnemonic);
      Assert.equal(mnemonic, 'toss true onion like penalty spot cloth need disease start coyote suggest', 'Must be equal parameter');
    });
  });

  describe('#generateMnemonic()', async() => {
    it('Generate Passphrase', async() => {
      let result = HDNode.generateMnemonic();
      Assert.notEqual(result, null, 'Must not null');
      Assert.equal(result.split(' ').length, 12, 'Must be 12 words');
    });
  });

  describe('#mnemonicToSeed()', async() => {
    it('Generate seed from passphrase', async() => {
      const mnemonic = 'toss true onion like penalty spot cloth need disease start coyote suggest';
      let result = HDNode.mnemonicToSeed(mnemonic);
      Assert.equal(result.toString('hex'), '5198621a5818f304cf735012027b946bc95c93fb6499b36928bbb8ac96dfb279b07d7a51189e4b0d72b788eb62984988e7562a34ec59f1e1ff46ba7ddebab24e', 'Seed must be valid');
    });
  });

  describe('#createMasterKeyPair()', async() => {
    it('BTC', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.BTC.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('BCH', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.BCH.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('LTC', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.LTC.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('DOGE', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.DOGE.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('DASH', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.DASH.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('ETH', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.ETH.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('ETC', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.ETC.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('EOS', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.EOS.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('NEO', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.NEO.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
    it('ADA', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.ADA.network);
      Assert.equal(seed.toString('hex'), '1158455458fe4d0f1fed4d1b7e60610adbaef29a4f0703772081b9a90615e6a474258ac8973fb011bdaf72b14854ba0f68b4bac8cf97cf8cf9ea3ddbf6b9c78f');
    });
  });

  describe('#createHDKeyPair()', async() => {
    it('Derive from seed', async() => {
      const mnemonic = 'member escape copy resource talent jump piece nasty decide card talent guilt';
      let seed = HDNode.mnemonicToSeed(mnemonic, CoinType.ADA.network);
      let network = HDNode.getNetwork('BTC', false);
      let masterKeyPair = HDNode.createMasterKeyPair(seed, network);
      let keypair = HDNode.createHDKeyPair(masterKeyPair, "m/44'/" + (BIP44.BTC - BIP44.BTC) + "'/0'/0/0");

      Assert.equal(keypair.toWIF(), 'KxmsbJRgN6oDZCbLnM3ydSfZPbdhExNS4FRVUaw1xZArUTr5mHWM', 'Wif must be equal');
      Assert.equal(keypair.publicKey.toString('hex'), '03597bbcb489ab82d30607e7d68633e28778dc031a34053cc9078a694bc4b34f7d', 'Public key must be equal');
    });
  });

  describe('#getNetwork()', async() => {
    it('Mainnet', async() => {
      let networks = [
        { name: 'BTC', network: CoinType.BTC.network.mainnet },
        { name: 'BCH', network: CoinType.BCH.network.mainnet },
        { name: 'LTC', network: CoinType.LTC.network.mainnet },
        { name: 'DASH', network: CoinType.DASH.network.mainnet },
        { name: 'DOGE', network: CoinType.DOGE.network.mainnet },
        { name: 'ETH', network: CoinType.BTC.network.mainnet },
        { name: 'ETC', network: CoinType.BTC.network.mainnet },
        { name: 'NEO', network: CoinType.BTC.network.mainnet },
        { name: 'EOS', network: CoinType.BTC.network.mainnet },
        { name: 'ADA', network: CoinType.BTC.network.mainnet }
      ];

      networks.forEach((item) => {
        let actualNetwork = HDNode.getNetwork(item.name, false);
        Assert.equal(JSON.stringify(actualNetwork), JSON.stringify(item.network), `Network ${item.name} must be equal`);
      });
    });
    it('Testnet', async() => {
      let networks = [
        { name: 'BTC', network: CoinType.BTC.network.testnet },
        { name: 'BCH', network: CoinType.BCH.network.testnet },
        { name: 'LTC', network: CoinType.LTC.network.testnet },
        { name: 'DASH', network: CoinType.DASH.network.testnet },
        { name: 'DOGE', network: CoinType.DOGE.network.testnet },
        { name: 'ETH', network: CoinType.BTC.network.mainnet },
        { name: 'ETC', network: CoinType.BTC.network.mainnet },
        { name: 'NEO', network: CoinType.BTC.network.mainnet },
        { name: 'EOS', network: CoinType.BTC.network.mainnet },
        { name: 'ADA', network: CoinType.BTC.network.mainnet }
      ];

      networks.forEach((item) => {
        let actualNetwork = HDNode.getNetwork(item.name, true);
        Assert.equal(JSON.stringify(actualNetwork), JSON.stringify(item.network), `Network ${item.name} must be equal`);
      });
    });
  });

});