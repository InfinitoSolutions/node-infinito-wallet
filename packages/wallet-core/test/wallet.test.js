const chai = require('chai');
const AppError = require('../src/app_error.js');
const Messages = require('../src/messages');
const Wallet = require('../src/wallet');

chai.should();
const expect = chai.expect;

describe('wallet', async () => {
  describe('#constructor', async () => {
    it('private key is null', async () => {
      expect(() => new Wallet())
        .to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    });

    it('private key is string', async () => {
      expect(() => new Wallet('privatekey'))
        .not.to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    });

    it('private key is buffer', async () => {
      expect(() => new Wallet(Buffer.from('01001010100a0a', 'hex')))
        .not.to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    });

    it('private key is invalid', async () => {
      expect(() => new Wallet(10))
        .to.throw(AppError.create(Messages.invalid_parameter, 'privateKey').message);
    });

    it('private key is wif', async () => {
      let wallet = new Wallet('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX');
      wallet.privateKey.should.be.instanceof(Buffer);
    });

    it('private key is string', async () => {
      let wallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      wallet.privateKey.should.be.instanceof(Buffer);
    });

    it('private key is buffer', async () => {
      let wallet = new Wallet(Buffer.from('d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913', 'hex'));
      expect(wallet.getPrivateKey().toString('hex'))
        .to.equal('d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913');
      expect(wallet.getPublicKey()).to.equal(null);
      expect(wallet.getKeyPair()).to.equal(null);
      expect(wallet.getAddress()).to.equal(null);
    });
  });

  describe('signTx', async() => {
    let wallet = new Wallet(Buffer.from('d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913', 'hex'));
    expect(() => wallet.signTx())
        .to.throw('Cannot call abstract method');
  });
});