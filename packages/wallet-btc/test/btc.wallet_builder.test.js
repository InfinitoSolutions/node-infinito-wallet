const Assert = require('assert');
const chai = require('chai');
const InfinitoApi = require('node-infinito-api');
chai.should();
const WalletBuilder = require('../src/btc.wallet_builder');
require('dotenv').config();
const ConfigTest = require('./config.test');

let apiConfigMainnet = {
  apiKey: ConfigTest.API_KEY_MAINNET,
  secret: ConfigTest.SECRECT_MAINNET,
  baseUrl: ConfigTest.BASE_URL_MAINNET,
  logLevel: ConfigTest.LOG_LEVEL
};
let apiMainnet = new InfinitoApi(apiConfigMainnet);

describe('BtcWalletBuilder', async () => {
  describe('builder()', async () => {
    it('default', async () => {
      let builder = new WalletBuilder();
      builder.constructor.name.should.equal('BtcWalletBuilder')
      builder.platform.should.equal('BTC')
    });

    it('wallet for LTC', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('LTC')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      builder.platform.should.equal('LTC')
      wallet.getKeyPair().should.be.a('object')
    });

    it('case 2', async () => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('BTC')
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      let txBuilder = wallet.newTxBuilder();

      txBuilder.useApi(apiMainnet.getChainService().BTC);
      txBuilder.sendTo('39XpoaixBAbUZzaq7g73tmvogBw6rGv8JP', 10000)
      try {
        console.log('txBuilder :', await txBuilder.build());
      } catch (err) {
        console.log('err :', err);
      }
    });

    it('case 3 send max', async () => {
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
      try {
        console.log('txBuilder :', await txBuilder.build());
      } catch (err) {
        console.log('err :', err);
      }
    });

    it.only('case 3 send max', async () => {
      let apiConfigMainnet = {
        apiKey: ConfigTest.API_KEY_TESTNET,
        secret: ConfigTest.SECRECT_TESTNET,
        baseUrl: ConfigTest.BASE_URL_TESTNET,
        logLevel: ConfigTest.LOG_LEVEL
      };
      console.log(apiConfigMainnet)
      let apiMainnet = new InfinitoApi(apiConfigMainnet);
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform('BTC')
        .useTestnet(true)
        .withAddress('2N6aHknArYj4PLx7QjrUcFW3DhSpArwf65F')
        // .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();
      console.log('wallet :', wallet);
      let txBuilder = wallet.newTxBuilder();
      txBuilder.withSign(false)

      txBuilder.useApi(apiMainnet.getChainService().BTC);
      txBuilder.sendTo('moK9QHugQAVVnUkgVApNqWHcFaoJ9Acops', 10000)
      // txBuilder.sendMaxTo('39XpoaixBAbUZzaq7g73tmvogBw6rGv8JP')

      // // txBuilder
      // //   .addOutput("aa", "1")
      // //   .createTx()
      // //   .sign()
      // //   .send()
      try {
        console.log('txBuilder :', await txBuilder.build());
      } catch (err) {
        console.log('err :', err);
      }
    });

  });
});