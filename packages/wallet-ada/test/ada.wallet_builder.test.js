const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/ada.wallet_builder');

describe('AdaWalletBuilder', async () => {
  describe('builder()', async () => {
    it('default', async () => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('AdaWalletBuilder')
      builder.platform.should.equal('ADA')
    });

    it('wallet for ADA', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('ADA')
        // .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('ADA')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

  });
});