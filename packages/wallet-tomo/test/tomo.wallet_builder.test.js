const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/tomo.wallet_builder');

describe('TomoWalletBuilder', async () => {
  describe('builder()', async () => {
    it('default', async () => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('TomoWalletBuilder')
      builder.platform.should.equal('TOMO')
    });

    it('wallet for TOMO', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('TOMO')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('TOMO')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

  });
});