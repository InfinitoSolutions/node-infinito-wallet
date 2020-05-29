const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/ont.wallet_builder');

describe('OntWalletBuilder', async () => {
  describe('builder()', async () => {
    it('default', async () => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('OntWalletBuilder')
      builder.platform.should.equal('ONT')
    });

    it('wallet for ONT', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('ONT')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('ONT')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

  });
});