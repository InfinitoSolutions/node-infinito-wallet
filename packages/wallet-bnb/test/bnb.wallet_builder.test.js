const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/bnb.wallet_builder');

describe('BnbWalletBuilder', async () => {
  describe('builder()', async () => {
    it('default', async () => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('BnbWalletBuilder')
      builder.platform.should.equal('BNB')
    });

    it('wallet for BNB', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('BNB')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('BNB')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

    it('wallet for COSMOS', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('COSMOS')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('COSMOS')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

    it('wallet for IRIS', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('IRIS')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('IRIS')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

  });
});