const Assert = require('assert');
const chai = require('chai');
const WalletBuilder = require('../src/wallet_builder');
const Networks = require('../src/networks');

chai.should();
const expect = chai.expect;


describe('wallet_builder', async() => {

  describe('builder()', async() => {

    it('default', async() => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('WalletBuilder');
    });

    it('add mnemonic', async () => {
      let builder = new WalletBuilder();
      let keys = await builder
        .withPlatform('BTC')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .createKey();
      keys.privateKey.should.be.instanceof(Buffer);
    });

    it('use testnet', async () => {
      let builder = new WalletBuilder();
      let keys = await builder
        .withPlatform('BTC')
        .useTestnet(true)
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .createKey();
      keys.network.bech32.should.equal('tb');
    });
  });

  describe('build', async() => {
    it('Cannot call abstract method', async() => {
      let builder = new WalletBuilder();
      builder = builder
        .withPlatform('BTC')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude');
      
      try {
        await builder.build();
        Assert.fail();
      } catch (err) {
        Assert.equal('Cannot call abstract method', err.message);
      }
    });
  });

  describe('createKey', async() => {
    it('private key, mainnet', async() => {
      let builder = new WalletBuilder();
      builder = builder
        .withPlatform('BTC')
        .withPrivateKey('d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913');

      let result = await builder.createKey();
      expect(result.privateKey).to.equal('d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913');
      expect(JSON.stringify(result.network)).to.equal(JSON.stringify(Networks.getNetwork('BTC', false)));
    });

    it('private key, testnet', async() => {
      let builder = new WalletBuilder();
      builder = builder
        .withPlatform('BTC')
        .useTestnet(true)
        .withPrivateKey('d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913');

      let result = await builder.createKey();
      expect(result.privateKey).to.equal('d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913');
      expect(JSON.stringify(result.network)).to.equal(JSON.stringify(Networks.getNetwork('BTC', true)));
    });
  });

  describe('Sample Data - withConfig', async() => {

    let listCase = require('./wallet_builder_data');
    let index = 0;
    listCase.forEach( curCase => {
      index++;
      it(`case ${index}: ${curCase.name}`, async() => {
        // console.log('test :', curCase);
        let waletBuilder = new WalletBuilder();
        waletBuilder.withConfig(curCase.config);

        // console.log('curCase.expected.exception :', curCase.expected.exception);
        
        if ( curCase.expected.exception !== undefined ) {
          try {
            await waletBuilder.createKey();
            Assert.fail('Should be error', curCase);
          } catch (err) {
            Assert.equal(err.message, curCase.expected.exception);
          }
        } else {
          let result = await waletBuilder.createKey();

          Assert.equal(result.privateKey.toString('hex'), curCase.expected.privateKey);
          Assert.equal(JSON.stringify(result.network), JSON.stringify(curCase.expected.network));
        }
      });
    });
  }),

  describe('Sample Data - use builder method', async() => {

    let listCase = require('./wallet_builder_data');
    let index = 0;
    listCase.forEach( curCase => {
      index++;
      it(`case ${index}: ${curCase.name}`, async() => {
        // console.log('test :', curCase);
        let waletBuilder = new WalletBuilder();
        waletBuilder = 
          waletBuilder
            .withPlatform(curCase.config.platform)
            .withPrivateKey(curCase.config.privateKey)
            .withWif(curCase.config.privateKey)
            .withMnemonic(curCase.config.mnemonic, curCase.config.password)
            .withHDPath(curCase.config.hdPath)
            .useTestnet(curCase.config.testnet);

        // console.log('curCase.expected.exception :', curCase.expected.exception);
        
        if ( curCase.expected.exception !== undefined ) {
          try {
            await waletBuilder.createKey();
            Assert.fail('Should be error', curCase);
          } catch (err) {
            Assert.equal(err.message, curCase.expected.exception);
          }
        } else {
          let result = await waletBuilder.createKey();

          Assert.equal(result.privateKey.toString('hex'), curCase.expected.privateKey);
          Assert.equal(JSON.stringify(result.network), JSON.stringify(curCase.expected.network));
        }
      });
    });
  });
});