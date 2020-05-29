const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/eth.wallet_builder');

describe('EthWalletBuilder', async () => {
  describe('builder()', async () => {
    it('default', async () => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('EthWalletBuilder')
      builder.platform.should.equal('ETH')
    });

    it('wallet for ETH', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('ETH')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('ETH')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

    it('wallet for ETC', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('ETC')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('ETC')
      wallet.getKeyPair().should.be.a('object')
      console.log(wallet);
    });

  });
});