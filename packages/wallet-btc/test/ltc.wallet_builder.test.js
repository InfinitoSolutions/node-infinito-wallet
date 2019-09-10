const Assert = require('assert');
const chai = require('chai');
const InfinitoApi = require('node-infinito-api');
chai.should();
const WalletBuilder = require('../src/btc.wallet_builder');
const ConfigTest = require('./config.test');

const PLATFORM = 'LTC';
let apiConfigMainnet = {
  apiKey: ConfigTest.API_KEY_MAINNET,
  secret: ConfigTest.SECRECT_MAINNET,
  baseUrl: ConfigTest.BASE_URL_MAINNET,
  logLevel: ConfigTest.LOG_LEVEL
};

let apiMainnet = new InfinitoApi(apiConfigMainnet);

describe.only('LtcWalletBuilder', async() => {

  describe('builder()', async() => {

    it.only('default', async() => {
      let builder = new WalletBuilder();
      console.log('builder :', builder, builder.constructor.name);
    });

    it.only('case 1', async() => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('LTC')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      console.log('wallet :', wallet);
    });

    it('case 2', async() => {
      let builder = new WalletBuilder(PLATFORM);
      let wallet = await builder
        .withPlatform('BTC')
        // .useTestnet(true)
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      console.log('wallet :', wallet);
      let txBuilder = wallet.newTxBuilder();

      txBuilder.useApi(apiMainnet.getChainService().LTC);
      txBuilder.sendTo('39XpoaixBAbUZzaq7g73tmvogBw6rGv8JP', 10000)

      // txBuilder
      //   .addOutput("aa", "1")
      //   .createTx()
      //   .sign()
      //   .send()
      try{

        console.log('txBuilder :', await txBuilder.build());
      } catch (err) {
        console.log('err :', err);
      }
    });

    it('case 3 send max', async() => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('BTC')
        // .useTestnet(true)
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      console.log('wallet :', wallet);
      let txBuilder = wallet.newTxBuilder();

      txBuilder.useApi(apiMainnet.getChainService().BTC);
      // txBuilder.sendTo('39XpoaixBAbUZzaq7g73tmvogBw6rGv8JP', 10000)
      txBuilder.sendMaxTo('39XpoaixBAbUZzaq7g73tmvogBw6rGv8JP')

      // txBuilder
      //   .addOutput("aa", "1")
      //   .createTx()
      //   .sign()
      //   .send()
      try{

        console.log('txBuilder :', await txBuilder.build());
      } catch (err) {
        console.log('err :', err);
      }
    });

  });
});