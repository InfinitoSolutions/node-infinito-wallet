const Assert = require('assert');
const chai = require('chai');
const InfinitoApi = require('node-infinito-api');
const WalletBuilder = require('../src/btc.wallet_builder');
const Wallet = require('../src/btc.wallet');
const ConfigTest = require('./config.test');
const Messages = require('../src/messages');
const { AppError, Networks } = require('infinito-wallet-core');

chai.should();
const expect = chai.expect;

describe('BtcWallet', async () => {
  describe('#constructor', async () => {
    it('no paramenter', async () => {
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
      Assert.equal(JSON.stringify(Networks.getNetwork('BTC')), JSON.stringify(wallet.network), 'wallet.network mus be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('03f6d8254b8ac798c56872085e53d875cf4bab6db9a0275704553338f33c1f1760', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('03f6d8254b8ac798c56872085e53d875cf4bab6db9a0275704553338f33c1f1760', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('141BZSiwSttMPpyj4dttQuML8x2GcCqVva', wallet.address, 'wallet.wif must be equal');
    })

    it('private key, testnet network', async () => {
      let wallet = new Wallet('4e1719ca38920a00e9ec9c163ab1162f1710471a0efb032fd684b9edbe594529', Networks.getNetwork("BTC", true));

      Assert.equal('cQCVtQhYEATb7d7XgZ1nffDETJXEAxUpQkeTYPsFMShu9mQ1gxSB', wallet.wif, 'wallet.wif must be equal');
      Assert.equal(JSON.stringify(Networks.getNetwork("BTC", true)), JSON.stringify(wallet.network), 'wallet.network mus be equal');
      Assert.equal('4e1719ca38920a00e9ec9c163ab1162f1710471a0efb032fd684b9edbe594529', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('0225ab45606ffd6c839db9b93d13dd57213bafaa16fba29fa020a8802943b0d0f5', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('4e1719ca38920a00e9ec9c163ab1162f1710471a0efb032fd684b9edbe594529', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('0225ab45606ffd6c839db9b93d13dd57213bafaa16fba29fa020a8802943b0d0f5', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('moK9QHugQAVVnUkgVApNqWHcFaoJ9Acops', wallet.address, 'wallet.wif must be equal');
    })

    it('wif, default network', async () => {
      // Wif length is 52
      let wallet = new Wallet('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX');

      Assert.equal('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX', wallet.wif, 'wallet.wif must be equal');
      Assert.equal(JSON.stringify(Networks.getNetwork('BTC')), JSON.stringify(wallet.network), 'wallet.network mus be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('03f6d8254b8ac798c56872085e53d875cf4bab6db9a0275704553338f33c1f1760', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('03f6d8254b8ac798c56872085e53d875cf4bab6db9a0275704553338f33c1f1760', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('141BZSiwSttMPpyj4dttQuML8x2GcCqVva', wallet.address, 'wallet.wif must be equal');
    })

    it('private key (buffer), default network', async () => {
      // Buffer length is 32
      let wallet = new Wallet(Buffer.from('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', 'hex'));

      Assert.equal('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX', wallet.wif, 'wallet.wif must be equal');
      Assert.equal(JSON.stringify(Networks.getNetwork('BTC')), JSON.stringify(wallet.network), 'wallet.network mus be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('03f6d8254b8ac798c56872085e53d875cf4bab6db9a0275704553338f33c1f1760', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('03f6d8254b8ac798c56872085e53d875cf4bab6db9a0275704553338f33c1f1760', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('141BZSiwSttMPpyj4dttQuML8x2GcCqVva', wallet.address, 'wallet.wif must be equal');
    })

    it('private key (buffer), testnet network', async () => {
      let wallet = new Wallet(Buffer.from('4e1719ca38920a00e9ec9c163ab1162f1710471a0efb032fd684b9edbe594529', 'hex'), Networks.getNetwork("BTC", true));

      Assert.equal('cQCVtQhYEATb7d7XgZ1nffDETJXEAxUpQkeTYPsFMShu9mQ1gxSB', wallet.wif, 'wallet.wif must be equal');
      Assert.equal(JSON.stringify(Networks.getNetwork("BTC", true)), JSON.stringify(wallet.network), 'wallet.network mus be equal');
      Assert.equal('4e1719ca38920a00e9ec9c163ab1162f1710471a0efb032fd684b9edbe594529', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('0225ab45606ffd6c839db9b93d13dd57213bafaa16fba29fa020a8802943b0d0f5', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('4e1719ca38920a00e9ec9c163ab1162f1710471a0efb032fd684b9edbe594529', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('0225ab45606ffd6c839db9b93d13dd57213bafaa16fba29fa020a8802943b0d0f5', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('moK9QHugQAVVnUkgVApNqWHcFaoJ9Acops', wallet.address, 'wallet.wif must be equal');
    })

    it('wif (buffer), default network', async () => {
      expect(() => new Wallet(Buffer.from('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX')))
        .to.throw(AppError.create(Messages.invalid_parameter, 'privateKey').message);
    })

  });

  describe('#getNetwork', async () => {
    it('default network', async () => {
      // Hex string with 64 characters
      let wallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      Assert.equal('141BZSiwSttMPpyj4dttQuML8x2GcCqVva', wallet.address, 'wallet.wif must be equal');
      Assert.equal(JSON.stringify(Networks.getNetwork('BTC')), JSON.stringify(wallet.getNetwork()), 'wallet.network mus be equal');

      wallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', null);
      Assert.equal('141BZSiwSttMPpyj4dttQuML8x2GcCqVva', wallet.address, 'wallet.wif must be equal');
      Assert.equal(JSON.stringify(Networks.getNetwork('BTC')), JSON.stringify(wallet.getNetwork()), 'wallet.network mus be equal');
    })

    it('mainnet network', async () => {
      // Hex string with 64 characters
      let wallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', Networks.getNetwork('BTC'));

      Assert.equal(JSON.stringify(Networks.getNetwork('BTC')), JSON.stringify(wallet.getNetwork()), 'wallet.network mus be equal');
    })

    it('testnet network', async () => {
      // Hex string with 64 characters
      let wallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', Networks.getNetwork('BTC', true));

      Assert.equal(JSON.stringify(Networks.getNetwork('BTC', true)), JSON.stringify(wallet.getNetwork()), 'wallet.network mus be equal');
    })
  });

  describe('signTx()', async () => {

  });

});