const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/trx.wallet_builder');

describe('TrxWalletBuilder', async () => {
  describe('builder()', async () => {
    it('default', async () => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('TrxWalletBuilder')
      builder.platform.should.equal('TRX')
    });

    it('wallet for TRX', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('TRX')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('TRX')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

  });
});