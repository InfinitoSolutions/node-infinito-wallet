const Assert = require('assert');
const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/wallet_builder');

describe('wallet_builder', async() => {

  describe('builder()', async() => {

    it('default', async() => {
      let builder = new WalletBuilder();
      console.log('builder :', builder, builder.constructor.name);
    });

    it('case 1', async() => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('BTC')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .createKey();
      console.log('wallet :', wallet);
    });

    it('case 2', async() => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('BTC')
        .useTestnet(true)
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .createKey();
      console.log('wallet :', wallet);
      // let txBuilder = wallet.newTransactionBuilder();
      // console.log('newTransactionBuilder :', txBuilder.build());
    });
  });
});