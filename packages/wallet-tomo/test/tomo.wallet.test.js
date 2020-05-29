const Assert = require('assert');
const chai = require('chai');
const Wallet = require('../src/tomo.wallet');
const Messages = require('../src/messages');
const { AppError, Networks } = require('infinito-wallet-core');

chai.should();
const expect = chai.expect;

describe('TomoWallet', async () => {
  describe('#constructor', async () => {
    it('no paramenter', async () => {
      expect(() => new Wallet())
        .to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    })

    it('private key is null', async () => {
      expect(() => new Wallet(null))
        .to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    })
  })
});