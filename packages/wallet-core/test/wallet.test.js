const chai = require('chai');
const AppError = require('../src/app_error.js');
const Messages = require('../src/messages');
const Wallet = require('../src/wallet');

chai.should();
const expect = chai.expect;

describe('wallet', async() => {

  describe('#constructor', async() => {
    it('private key is null', async() => {
      expect(() => new Wallet())
        .to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    });
    it('private key is string', async() => {
      expect(() => new Wallet('privatekey'))
        .not.to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    });
    it('private key is buffer', async() => {
      expect(() => new Wallet(Buffer.from('01001010100a0a', 'hex')))
        .not.to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    });
    it('private key is invalid', async() => {
      expect(() => new Wallet(10))
        .to.throw(AppError.create(Messages.invalid_parameter, 'privateKey').message);
    });
  });

});