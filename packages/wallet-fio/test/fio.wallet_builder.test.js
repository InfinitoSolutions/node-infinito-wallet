const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/fio.wallet_builder');

describe('FioWalletBuilder', async () => {
  describe('builder()', async () => {
    it('default', async () => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('FioWalletBuilder')
      builder.platform.should.equal('FIO')
    });

    it('wallet for FIO', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('FIO')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('FIO')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

  });
});