const Assert = require('assert');
const CoinType = require('../lib/coin_type');
const Keychain = require('../lib/keychain');

describe('keychain', async() => {

  describe('#getKeyPairFromPassPhrase()', async() => {

    it('Missing hdpath', async() => {
      try {
        Keychain.getKeyPairFromPassPhrase({ coinType: 'INVALID' });
        Assert.fail();
      } catch (err) {
        Assert.equal(err.code, 'infinito.wallet.missing_parameter');
        Assert.equal(err.message, 'Missing required parameter hdPath');
      }
    });

    it('BTC.mainnet', async() => {
      const mnemonics = [
        ['theory find wrestle ripple volcano boil insect oblige submit border easy hub', '0edf5b18281aee7dcd2f4d857f707e1eb15a6a063a4485c922690d789e61b014', '031f341d226abb93d7962103f8a5a6d5f519fbc58d302e172585aec6eacd8af04c'],
        ['slender note dilemma renew fun bulk better elephant super almost dish depth', 'e0fd71d084be8c667aa513f9c8639f0bee5363639b3bcb14943387749ed91cce', '03ecf03b815e3c3f6c897e5a811a89019253a7efa1e0625347b7fd07d8db4017a7'],
        ['target thunder mom true elephant tower tomato enhance craft army axis artist', 'dedd5697d1f25d11b411a5d5cac2d9ccba578523ce6c84b2623a141362657274', '03f9274c1994d0c3cb9e36514b6c81ae63896cc00fe683ef4f199df891c9434531'],
        ['fiction size reason barrel school destroy assume beyond polar square column angle', 'c5e2c32a509a23324f8755e6df564e15ee18c00c5a526c5e71cec757314f1a10', '02ee82abcfca784db2b55b2546918532383e4aad3f4e93148e44ee6b79e975789e'],
        ['category uncle teach toe whip maid myth insane paper canyon truck attack', '4901a4e0b92b30af72461310632ce06b962e4aaa627c0aabdffe5fc8f40226b1', '02ef52511897b2a44c96b99ed56adb1556e3878df829ac489b8a8d063ae7d92319']
      ];
      const hdPath = "m/44'/0'/0'/0/0";
      mnemonics.forEach((mnemonic) => {
        let result = Keychain.getKeyPairFromPassPhrase({
          mnemonic: mnemonic[0],
          hdPath,
          coinType: 'BTC',
          isTestNet: false
        });

        Assert.equal(result.privateKey.toString('hex'), mnemonic[1], 'Private key must be equal');
        Assert.equal(result.publicKey.toString('hex'), mnemonic[2], 'Public key must be equal');
      });

    });

  });

  describe('#getWif()', async() => {

    it('wif.testnet', async() => {
      let keys = [
        'cSWNkEtBRuENC65quSNTRGa86SHWgZFdvSAXnUVBUttomy6SZv9r',
        'cTPYDFBog72ZaRvFrGos8krL2j7HepqDG3v5p6mPQWhjXPwem4Py',
        'cSNDRe5nnCP516S2uB1dUmB157pgSxihu3feUugf7zexKsoVYo9H',
        'cPb2n1Ne7vW1umrdEngpgohSdMSooHsJ1NzV7VNAKdQWn6KYsHep',
        'cTSrt5Z2FToatbRMSqGGdgtmN1pRoeNPF6RSCzQd5Ta941osHcxd',
        'cNnphbHcoypVsupWENmmvrpdd4YPKKf3LBrFBoXE4UPbTBR3oXdY',
        'cPJASeTZ3boZajBkBL7es7GqS83WSiWUndiKpgtUA6bwVhAakiJY',
        'cVBUZBnBsFzryfvi6nfT7TZa3JHLDbv1YjKKzdztThUaoC6jTqBg',
        'cVQ1H8wBkYAThrMWA1aX3HhBj8qRL8XsWKj12m6agw7uzcHwqcwi',
        'cU2TfeZzmbxcr7A2x8BZ1aP9WNCVDDMEKw48A9SEsVoaiCxXxyc5',
        'cVt5VKN28UUB5KhSCtHGCcMWeGAeBP7ZTDyyBLT69YvFjP5bRQh6',
        'cPVa8xmXqYwatjvbJzHXYdzmAkH12MKRVCE8zG7jMAawaeuA4Ujw',
        'cPLDYLGG2h1fn7p5fJEHo64MHv8LsbPEns9gf4chjTMvHf72tctB',
        'cTE8WAVj19rFZiA2VmozFdeQWACCtSCzknmeTeTaEzuDUwj7Uk1u',
        'cSa7b5LaQUCreAUbdSWCyDAR1Lk7BKbZhZ36hmuPy4v3ASqpBCLg',
        'cTz27dkg3LVzGuofSDs1WUZci9ZzdRxwThujn26Xytn2WwUSVJgD',
        'cVXSBMWAuDUiYqLgkUbuereAXchhUoYp6wL22uiCyrFEth5kzZZG',
        'cSZ9N2ZT9KJEf8QfyYpQRg1Ek6SuU6Ck1vGQRegGeWFcMJXPcHK1',
        'cR9BGgdqEF2Ga7eBJ7Fkp4J1EZHyWrue6X1ARbQAR3hKNFy9rU13',
        'cVAPkRjmaV2ZtQRgGkLVKDj27jB7ftFJyUHsy7tAdC4yawqm5Aqu',
      ];

      let network = CoinType.BTC.network.testnet;
      keys.forEach((key) => {
        let wifVal = Keychain.getWif(key, network);
        Assert.equal(key, wifVal);
      });

    });

    it('wif.mainnet', async() => {
      let keys = [
        'L29PHKtKzqY72ecaX2ZL3x54UCz7279wrQ24g42fynEoXE3H54nH',
        'L32YkLBxF3LJQzSzTrzjmSMGQVoszNjXC1mchgJsuQ3jGewYarLe',
        'L21Dxj5wM8goqexmWmCW7SfwStXGnWd1q1XBNVE9cszx58kVTSgA',
        'KyE3K6NngrokkLPMrNshKVCP189Q8qmbwLr214uepWkWXMHc2LTg',
        'L35sRAZApQ7Kj9x64RT9GNPhjnX29CGhB4Gy6Zx7aLv8oGjgBHcJ',
        'KxRqEgHmNv8EiUMEqxxeZYKZzqEyesZMG9hn5P4iZMjbCSMWh6pT',
        'KxwAyjThcY7JRHiUnvJXVnmmotk6nGQnibZriGRxeywwExBMuFaW',
        'L4pV6GnLSCJbpETSiNrKk94WR4yvZ9pKUhArtDYNxapaYT1LDNbg',
        'L531pDwLKUUCYQtEmbmPfyC86uY1fgSBSHaXvLe5BpTujsBqHWoU',
        'L3fUCja9LYGMgfgmZiNReFt5t8u5YmFYFtuf3iyjNP9aTTnYR4rg',
        'L5X62QNAhQmuutEApUU8qHrT22sEWw1sPBqW4uzaeSGFUe1yqegT',
        'Ky8ag3mgQVFKjJTKvaUQBKVhYWybMuDjRA5fsqfDr3vwKum5hyhB',
        'KxyE5RGQbdKQcgLpGtRARmZHfgpwD9HYiq1DYeACELhv2v1eAAbr',
        'L2s93FVsa69zQGgm7MzrtK9LsvtoDz7JgkdBME14jtFDECZouFpY',
        'L2D88ALiyQWbUj1LF2h5btfMP7ShWsVsdWtdbMStTxG2uhkweDAp',
        'L3d2eikpcGoj7ULQ3p3t9A4Z5vGaxysFPfmGfbe2Un82GCS3vKhW',
        'L5ASiSWKU9nTPPsRN4nnHY96uPQHpMT82uBYvVFhUjbEdx4S7DCM',
        'L2C9u7ZbiFbyVgwQb91H4MWB7s9Voe73wt7wKEDm9Pbc6ZRrokvs',
        'KznBomdyoBL1QgAuuhSdSjnwcKzZrQox2UrhKAweuw3K7WzWxhvh',
        'L4oQHWjv9RLJixxQtLXMwuDxVVsi1S9cuS9QrhRf85QyLCjvRM9E'
      ];

      let network = CoinType.BTC.network.mainnet;
      keys.forEach((key) => {
        let wifVal = Keychain.getWif(key, network);
        Assert.equal(key, wifVal);
      });

    });

    it('privateKey.testnet', async() => {

      let wifKeys = [
        ['cSWNkEtBRuENC65quSNTRGa86SHWgZFdvSAXnUVBUttomy6SZv9r', '92f629d0d444a43da8ef5a9c94ea1b8eacb8c065fe8f137c8bd8ec4ad06accf4'],
        ['cTPYDFBog72ZaRvFrGos8krL2j7HepqDG3v5p6mPQWhjXPwem4Py', 'ad482832b66cef5a17f0bbc3f53638ead20adfd0b681423c8162196e8883e00d'],
        ['cSNDRe5nnCP516S2uB1dUmB157pgSxihu3feUugf7zexKsoVYo9H', '8ec36e49d739d911366e7f61ecc340ca3b729c89e5190233e042980420f50f63'],
        ['cPb2n1Ne7vW1umrdEngpgohSdMSooHsJ1NzV7VNAKdQWn6KYsHep', '3bd82e124858245dab85d62740ba752a3d23a0e18c8d6bef98ce84df3b936b84'],
        ['cTSrt5Z2FToatbRMSqGGdgtmN1pRoeNPF6RSCzQd5Ta941osHcxd', 'aefda305c31ff677e4e709fc8579838b6c936a968ec67ede8bf1d36ec7d61981'],
        ['cNnphbHcoypVsupWENmmvrpdd4YPKKf3LBrFBoXE4UPbTBR3oXdY', '2412bd403bf099faa82e754ebe84d921038dea654281bd9412f5afbecf540813'],
        ['cPJASeTZ3boZajBkBL7es7GqS83WSiWUndiKpgtUA6bwVhAakiJY', '332ac0ddb2e2e5ae614ba4d9e565277de8bac4d6c3337c2bf82c6f3b472da64a'],
        ['cVBUZBnBsFzryfvi6nfT7TZa3JHLDbv1YjKKzdztThUaoC6jTqBg', 'e2c03fc661b033add592c9733b162650f532b05adb642e49ea11352b71b25d2d'],
        ['cVQ1H8wBkYAThrMWA1aX3HhBj8qRL8XsWKj12m6agw7uzcHwqcwi', 'e9325cfe7c4e32b53a0ecd39a867b7932b3e50a4db97a23fb8d0308a495734a6'],
        ['cU2TfeZzmbxcr7A2x8BZ1aP9WNCVDDMEKw48A9SEsVoaiCxXxyc5', 'c04697d4889627685f358e9154d0a22d493c27c547fa12941f810aae199f1166'],
        ['cVt5VKN28UUB5KhSCtHGCcMWeGAeBP7ZTDyyBLT69YvFjP5bRQh6', 'f7a369ca0896a65ed678b3c752877fb74cefa938cc6e4ff15f7412c864c63272'],
        ['cPVa8xmXqYwatjvbJzHXYdzmAkH12MKRVCE8zG7jMAawaeuA4Ujw', '3909368a7607b1f4f32a65d9adfe103acc131949a8b6d83b66dadae1a1ba08be'],
        ['cPLDYLGG2h1fn7p5fJEHo64MHv8LsbPEns9gf4chjTMvHf72tctB', '34392e17d9e8cc44e5483383bedc9ce4b3169a1550b19e99bc271d4278774fe7'],
        ['cTE8WAVj19rFZiA2VmozFdeQWACCtSCzknmeTeTaEzuDUwj7Uk1u', 'a8710f4158c65dde0618e2472082cc81f46bcda61852d0d2377c563b69ed3f91'],
        ['cSa7b5LaQUCreAUbdSWCyDAR1Lk7BKbZhZ36hmuPy4v3ASqpBCLg', '94e287946baac5ca03408b24fe2f146e5cb0280f14e893a2fc9451110528b451'],
        ['cTz27dkg3LVzGuofSDs1WUZci9ZzdRxwThujn26Xytn2WwUSVJgD', 'bf052e99835dc0650629e8d1aa6f3a1eb74aef3a0d15bf2c05642a94f5441bdc'],
        ['cVXSBMWAuDUiYqLgkUbuereAXchhUoYp6wL22uiCyrFEth5kzZZG', 'ed04c66b55d737fcb9a2965910b904a11a96adc0e42c3fe6c382653aaf5ac140'],
        ['cSZ9N2ZT9KJEf8QfyYpQRg1Ek6SuU6Ck1vGQRegGeWFcMJXPcHK1', '9462dd2bd5e23c4521e11f6c3412d7d4f2ac7df1b77a67f2368d618f8daaed51'],
        ['cR9BGgdqEF2Ga7eBJ7Fkp4J1EZHyWrue6X1ARbQAR3hKNFy9rU13', '6a381dbe6e562f6cfb77e3afdd3413268779aa6df39eb5fd61533291e100d498'],
        ['cVAPkRjmaV2ZtQRgGkLVKDj27jB7ftFJyUHsy7tAdC4yawqm5Aqu', 'e231a3d51d7cb4b87db4a1f7ce1492128d6da583d55837d01d96847a1d3b61f9'],
      ];

      let network = CoinType.BTC.network.testnet;
      wifKeys.forEach((pair) => {
        let wifVal = Keychain.getWif(pair[1], network);
        Assert.equal(pair[0], wifVal);
      });

    });

    it('privateKey.mainnet', async() => {

      let wifKeys = [
        ['L29PHKtKzqY72ecaX2ZL3x54UCz7279wrQ24g42fynEoXE3H54nH', '92f629d0d444a43da8ef5a9c94ea1b8eacb8c065fe8f137c8bd8ec4ad06accf4'],
        ['L32YkLBxF3LJQzSzTrzjmSMGQVoszNjXC1mchgJsuQ3jGewYarLe', 'ad482832b66cef5a17f0bbc3f53638ead20adfd0b681423c8162196e8883e00d'],
        ['L21Dxj5wM8goqexmWmCW7SfwStXGnWd1q1XBNVE9cszx58kVTSgA', '8ec36e49d739d911366e7f61ecc340ca3b729c89e5190233e042980420f50f63'],
        ['KyE3K6NngrokkLPMrNshKVCP189Q8qmbwLr214uepWkWXMHc2LTg', '3bd82e124858245dab85d62740ba752a3d23a0e18c8d6bef98ce84df3b936b84'],
        ['L35sRAZApQ7Kj9x64RT9GNPhjnX29CGhB4Gy6Zx7aLv8oGjgBHcJ', 'aefda305c31ff677e4e709fc8579838b6c936a968ec67ede8bf1d36ec7d61981'],
        ['KxRqEgHmNv8EiUMEqxxeZYKZzqEyesZMG9hn5P4iZMjbCSMWh6pT', '2412bd403bf099faa82e754ebe84d921038dea654281bd9412f5afbecf540813'],
        ['KxwAyjThcY7JRHiUnvJXVnmmotk6nGQnibZriGRxeywwExBMuFaW', '332ac0ddb2e2e5ae614ba4d9e565277de8bac4d6c3337c2bf82c6f3b472da64a'],
        ['L4pV6GnLSCJbpETSiNrKk94WR4yvZ9pKUhArtDYNxapaYT1LDNbg', 'e2c03fc661b033add592c9733b162650f532b05adb642e49ea11352b71b25d2d'],
        ['L531pDwLKUUCYQtEmbmPfyC86uY1fgSBSHaXvLe5BpTujsBqHWoU', 'e9325cfe7c4e32b53a0ecd39a867b7932b3e50a4db97a23fb8d0308a495734a6'],
        ['L3fUCja9LYGMgfgmZiNReFt5t8u5YmFYFtuf3iyjNP9aTTnYR4rg', 'c04697d4889627685f358e9154d0a22d493c27c547fa12941f810aae199f1166'],
        ['L5X62QNAhQmuutEApUU8qHrT22sEWw1sPBqW4uzaeSGFUe1yqegT', 'f7a369ca0896a65ed678b3c752877fb74cefa938cc6e4ff15f7412c864c63272'],
        ['Ky8ag3mgQVFKjJTKvaUQBKVhYWybMuDjRA5fsqfDr3vwKum5hyhB', '3909368a7607b1f4f32a65d9adfe103acc131949a8b6d83b66dadae1a1ba08be'],
        ['KxyE5RGQbdKQcgLpGtRARmZHfgpwD9HYiq1DYeACELhv2v1eAAbr', '34392e17d9e8cc44e5483383bedc9ce4b3169a1550b19e99bc271d4278774fe7'],
        ['L2s93FVsa69zQGgm7MzrtK9LsvtoDz7JgkdBME14jtFDECZouFpY', 'a8710f4158c65dde0618e2472082cc81f46bcda61852d0d2377c563b69ed3f91'],
        ['L2D88ALiyQWbUj1LF2h5btfMP7ShWsVsdWtdbMStTxG2uhkweDAp', '94e287946baac5ca03408b24fe2f146e5cb0280f14e893a2fc9451110528b451'],
        ['L3d2eikpcGoj7ULQ3p3t9A4Z5vGaxysFPfmGfbe2Un82GCS3vKhW', 'bf052e99835dc0650629e8d1aa6f3a1eb74aef3a0d15bf2c05642a94f5441bdc'],
        ['L5ASiSWKU9nTPPsRN4nnHY96uPQHpMT82uBYvVFhUjbEdx4S7DCM', 'ed04c66b55d737fcb9a2965910b904a11a96adc0e42c3fe6c382653aaf5ac140'],
        ['L2C9u7ZbiFbyVgwQb91H4MWB7s9Voe73wt7wKEDm9Pbc6ZRrokvs', '9462dd2bd5e23c4521e11f6c3412d7d4f2ac7df1b77a67f2368d618f8daaed51'],
        ['KznBomdyoBL1QgAuuhSdSjnwcKzZrQox2UrhKAweuw3K7WzWxhvh', '6a381dbe6e562f6cfb77e3afdd3413268779aa6df39eb5fd61533291e100d498'],
        ['L4oQHWjv9RLJixxQtLXMwuDxVVsi1S9cuS9QrhRf85QyLCjvRM9E', 'e231a3d51d7cb4b87db4a1f7ce1492128d6da583d55837d01d96847a1d3b61f9'],
      ];

      let network = CoinType.BTC.network.mainnet;
      wifKeys.forEach((pair) => {
        let wifVal = Keychain.getWif(pair[1], network);
        Assert.equal(pair[0], wifVal);
      });

    });

  });

});