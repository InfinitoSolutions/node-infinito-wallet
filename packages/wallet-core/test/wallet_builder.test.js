const chai = require('chai');
const WalletBuilder = require('../src/wallet_builder');

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

  describe('Sample Data - withConfig', async() => {

    let listCase = require('./wallet_builder_data');
    let index = 0;
    listCase.forEach( curCase => {
      index++;
      it(`case ${index}: ${curCase.name}`, async() => {
        console.log('test :', curCase);
        let waletBuilder = new WalletBuilder();
        waletBuilder.withConfig(curCase.config);

        console.log('curCase.expected.exception :', curCase.expected.exception);
        
        if( curCase.expected.exception !== undefined ) {
          try {
            await waletBuilder.createKey();
            Assert.fail('Should be error', curCase);
          } catch(err) {
            Assert.equal(err.message, curCase.expected.exception);
          }
        } else {
          let result = await waletBuilder.createKey();

          Assert.equal(result.privateKey.toString("hex"), curCase.expected.privateKey);
          Assert.equal(JSON.stringify(result.network), JSON.stringify(curCase.expected.network));
        }
      })
    });
  }),

  describe('Sample Data - use builder method', async() => {

    let listCase = require('./wallet_builder_data');
    let index = 0;
    listCase.forEach( curCase => {
      index++;
      it(`case ${index}: ${curCase.name}`, async() => {
        console.log('test :', curCase);
        let waletBuilder = new WalletBuilder();
        waletBuilder = 
          waletBuilder
            .withPlatform(curCase.config.platform)
            .withPrivateKey(curCase.config.privateKey)
            .withWif(curCase.config.privateKey)
            .withMnemonic(curCase.config.mnemonic, curCase.config.password)
            .withHDPath(curCase.config.hdPath)
            .useTestnet(curCase.config.testnet);

        console.log('curCase.expected.exception :', curCase.expected.exception);
        
        if( curCase.expected.exception !== undefined ) {
          try {
            await waletBuilder.createKey();
            Assert.fail('Should be error', curCase);
          } catch(err) {
            Assert.equal(err.message, curCase.expected.exception);
          }
        } else {
          let result = await waletBuilder.createKey();

          Assert.equal(result.privateKey.toString("hex"), curCase.expected.privateKey);
          Assert.equal(JSON.stringify(result.network), JSON.stringify(curCase.expected.network));
        }
      })
    });
  })
});