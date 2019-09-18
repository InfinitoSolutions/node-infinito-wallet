const Assert = require('assert');
const chai = require('chai');
const AppError = require('../src/app_error.js');
const Messages = require('../src/messages');
const Keygen = require('../src/keygen');

chai.should();
const expect = chai.expect;

describe('keygen', async() => {

  describe('createKeypair - sample data', async() => {

    let listCase = require('./keygen_data');
    let index = 0;
    listCase.forEach( curCase => {
      index++;
      it(`case ${index}: ${curCase.name}`, async() => {
        let caseDesc = JSON.stringify(curCase);
        if ( curCase.expected.exception !== undefined ) {
          try {
            await Keygen.createKeypair(
              curCase.config.platform, 
              curCase.config.mnemonic, 
              curCase.config.password, 
              curCase.config.hdPath, 
              curCase.config.testnet);

            Assert.fail('Should be error', caseDesc);
          } catch (err) {
            Assert.equal(err.message, curCase.expected.exception, 'Error Message (' + caseDesc + ')');
          }
        } else {
          let result = await Keygen.createKeypair(
            curCase.config.platform, 
            curCase.config.mnemonic, 
            curCase.config.password, 
            curCase.config.hdPath, 
            curCase.config.testnet);

          Assert.equal(JSON.stringify(result.network), JSON.stringify(curCase.expected.network), 'Network (' + caseDesc + ')');
          Assert.equal(result.privateKey.toString('hex'), curCase.expected.privateKey, 'Private Key (' + caseDesc + ')');
          Assert.equal(result.publicKey.toString('hex'), curCase.expected.publicKey, 'Public Key (' + caseDesc + ')');
        }
      });
    });

  });

  describe('wifToPrivateKey', async() => {

    it('mainnet', () => {
      let key = Keygen.wifToPrivateKey('L4aYqMR6KoaN9QNCQcSSSbHuRyPytokaZX6CFLns6pYAPbFmtfXe');
      Assert.equal('db95008e70c0f681db0b400c1a21cecbb9189413f46ee4232b9057bc1ccce85d', key.toString('hex'));
    });

    it('testnet', () => {
      let key = Keygen.wifToPrivateKey('cVqwNqKfzKEhBvFPJE35cVi7MMvfkRQoivQaXNg5T7XwhHeSo8jV');
      Assert.equal('f6899a2d20e0b2fe4a5a9a1aeb4dc15664bad748b8663c633a0c5813f28209a7', key.toString('hex'));
    });

  });

  describe('privateKeytoWif', async() => {
    
    it('private key is undefined', async() => {
      expect(() => Keygen.privateKeytoWif())
        .to.throw(AppError.create(Messages.invalid_parameter, 'privateKey').message);
    });

    it('private key is null', async() => {
      expect(() => Keygen.privateKeytoWif(null))
        .to.throw(AppError.create(Messages.invalid_parameter, 'privateKey').message);
    });

    it('private key is buffer', async() => {
      let privateKey = Buffer.from('d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913', 'hex');
      let wif = Keygen.privateKeytoWif(privateKey, 0x80);
      Assert.equal('L4GPxhpxV49VMAArAZWKfKz112Q4FT8uoWhfxxahurLH5fVVcA4e', wif);

      wif = Keygen.privateKeytoWif(privateKey, 0xef);
      Assert.equal('cUdPRcpov7qkWbe7YyKT2eV4dFhTuuEbsYr95P3DQxzHLQZmZAiE', wif);
    });

    it('private key is buffer wif', async() => {
      expect(() => {
        let privateKey = Buffer.from('80d23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913', 'hex');
        Keygen.privateKeytoWif(privateKey, 0x80);
      })
        .to.throw('Invalid parameter privateKey');
    });

    it('private key is string', async() => {
      let privateKey = 'd23e531de1144cfa01c092b43e201dab1f8c2d3997dc8e185d5d503bfe7a1913';
      let wif = Keygen.privateKeytoWif(privateKey, 0x80);
      Assert.equal('L4GPxhpxV49VMAArAZWKfKz112Q4FT8uoWhfxxahurLH5fVVcA4e', wif);

      wif = Keygen.privateKeytoWif(privateKey, 0xef);
      Assert.equal('cUdPRcpov7qkWbe7YyKT2eV4dFhTuuEbsYr95P3DQxzHLQZmZAiE', wif);
    });

    it('private key is wif string', async() => {
      let privateKey = 'L4GPxhpxV49VMAArAZWKfKz112Q4FT8uoWhfxxahurLH5fVVcA4e';
      let wif = Keygen.privateKeytoWif(privateKey, 0x80);
      Assert.equal('L4GPxhpxV49VMAArAZWKfKz112Q4FT8uoWhfxxahurLH5fVVcA4e', wif);

      privateKey = 'cUdPRcpov7qkWbe7YyKT2eV4dFhTuuEbsYr95P3DQxzHLQZmZAiE';
      wif = Keygen.privateKeytoWif(privateKey, 0xef);
      Assert.equal('cUdPRcpov7qkWbe7YyKT2eV4dFhTuuEbsYr95P3DQxzHLQZmZAiE', wif);
    });

    it('private key is wif string and diferent version', async() => {
      expect(() => {
        let privateKey = 'L4GPxhpxV49VMAArAZWKfKz112Q4FT8uoWhfxxahurLH5fVVcA4e';
        let wif = Keygen.privateKeytoWif(privateKey, 0xef);
        Assert.equal('L4GPxhpxV49VMAArAZWKfKz112Q4FT8uoWhfxxahurLH5fVVcA4e', wif);
      })
        .to.throw('Invalid network version');

      expect(() => {
        let privateKey = 'cUdPRcpov7qkWbe7YyKT2eV4dFhTuuEbsYr95P3DQxzHLQZmZAiE';
        let wif = Keygen.privateKeytoWif(privateKey, 0x80);
        Assert.equal('cUdPRcpov7qkWbe7YyKT2eV4dFhTuuEbsYr95P3DQxzHLQZmZAiE', wif);
      })
        .to.throw('Invalid network version');
    });

    it('private key is wif string uncompress', async() => {
      let privateKey = '5KQsy7z5sJw2th984XUVF828hndVNrRT1a1c7LPbC4vkyPV4qpn';
      let wif = Keygen.privateKeytoWif(privateKey, 0x80, false);
      Assert.equal('5KQsy7z5sJw2th984XUVF828hndVNrRT1a1c7LPbC4vkyPV4qpn', wif);
    });

  });
  
});