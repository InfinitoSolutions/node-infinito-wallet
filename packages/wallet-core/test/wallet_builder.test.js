const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/wallet_builder');

describe('wallet_builder', async () => {
  describe('#builder', async () => {
    it('default', async () => {
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
});