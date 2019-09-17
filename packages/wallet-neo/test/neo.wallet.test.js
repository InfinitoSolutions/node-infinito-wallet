const Assert = require('assert');
const chai = require('chai');
const InfinitoApi = require('node-infinito-api');
const WalletBuilder = require('../src/neo.wallet_builder');
const Wallet = require('../src/neo.wallet');
const ConfigTest = require('./config.test');
const Messages = require('../src/messages');
const { AppError } = require('infinito-wallet-core');

chai.should();
const expect = chai.expect;

let apiConfigTestnet = {
  apiKey: ConfigTest.API_KEY_TESTNET,
  secret: ConfigTest.SECRECT_TESTNET,
  baseUrl: ConfigTest.BASE_URL_TESTNET,
  logLevel: ConfigTest.LOG_LEVEL
};

let apiTestnet = new InfinitoApi(apiConfigTestnet).getChainService().NEO;
console.log(apiTestnet)

describe('NeoWallet', async () => {
  describe('#constructor', async () => {
    it('no parameter', async () => {
      expect(() => new Wallet())
        .to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    })

    it('private key is null', async () => {
      expect(() => new Wallet(null))
        .to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    })

    it('private key, default network', async () => {
      // Hex string with 64 characters
      let wallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');

      Assert.equal('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX', wallet.wif, 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK', wallet.address, 'wallet.wif must be equal');
    })

    it('wif, default network', async () => {
      // Wif length is 52
      let wallet = new Wallet('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX');

      Assert.equal('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX', wallet.wif, 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK', wallet.address, 'wallet.wif must be equal');
    })

    it('private key (buffer), default network', async () => {
      // Buffer length is 32
      let wallet = new Wallet(Buffer.from('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', 'hex'));

      Assert.equal('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX', wallet.wif, 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK', wallet.address, 'wallet.wif must be equal');
    })

    it('wif (buffer), default network', async () => {
      expect(() => new Wallet(Buffer.from('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX')))
        .to.throw(AppError.create(Messages.invalid_parameter, 'privateKey').message);
    })

  });

  describe('#create transaction', async () => {
    it.only('create claim transaction', async () => {
      let wallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      let transationBuilder = wallet.newTxBuilder();
      transationBuilder.useApi(apiTestnet);
      transationBuilder.useType('CLAIM');
      let tx = await transationBuilder.build();
    });
  });

});