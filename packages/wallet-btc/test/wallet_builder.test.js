const Assert = require('assert');
const chai = require('chai');
chai.should();
const WalletBuilder = require('../src/btc.wallet_builder');

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
        .build();
      console.log('wallet :', wallet);
    });

    it('case 2', async() => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('BTC')
        // .useTestnet(true)
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      console.log('wallet :', wallet);
      let txBuilder = wallet.newTxBuilder();

      // txBuilder
      //   .addOutput("aa", "1")
      //   .createTx()
      //   .sign()
      //   .send()
      
      console.log('txBuilder :', txBuilder.build());
    });
  });
});