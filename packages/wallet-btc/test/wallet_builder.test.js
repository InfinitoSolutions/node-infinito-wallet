const Assert = require('assert');
const chai = require('chai');
const InfinitoApi = require('node-infinito-api');
const WalletBuilder = require('../src/btc.wallet_builder');
const ConfigTest = require('./config.test');

chai.should();
const expect = chai.expect;

let apiConfigMainnet = {
  apiKey: ConfigTest.API_KEY_MAINNET,
  secret: ConfigTest.SECRECT_MAINNET,
  baseUrl: ConfigTest.BASE_URL_MAINNET,
  logLevel: ConfigTest.LOG_LEVEL
};

let apiMainnet = new InfinitoApi(apiConfigMainnet);
const PLATFORM = 'BTC';

describe('wallet_builder', async() => {

  describe('builder()', async() => {

    it('default', async() => {
      let builder = new WalletBuilder();
      expect(builder.constructor.name).to.equals('BtcWalletBuilder');
    });

    it('generate wallet from passphrase', async() => {
      let builder = new WalletBuilder();
      let wallet = await builder
        .withPlatform(PLATFORM)
        .withMnemonic('goddess cradle need donkey fog add opinion ensure spoil shrimp honey rude')
        .build();

      // console.log('wallet :', wallet);
      // console.log('wallet.getPrivateKey() :', wallet.getPrivateKey());
      // console.log('wallet.privateKey :', wallet.privateKey.toString("hex"));
      // console.log('wallet.publicKey :', wallet.publicKey.toString("hex"));
      // console.log('wallet.address :', wallet.address);
      // console.log('wallet.wif :', wallet.wif);

      expect(wallet.address).to.equals("1LHdPfqF5zSgVP9N3Zp61apqqWbVXMqjsd");
      expect(wallet.wif).to.equals("L1k7YYr5VsARSM5yCXV5EmKpwzjmMo93jy4opY9sCDFNPGHLxN8u");
      expect(wallet.publicKey.toString("hex")).to.equals("0348ab0e867480a3a6055d1b76d31c3f67903afc61320fc54417cc986ae0ba00c1");
      
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

      txBuilder.useApi(apiMainnet.getChainService().BTC);
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