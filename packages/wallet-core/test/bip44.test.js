const chai = require('chai');
const AppError = require('../src/app_error.js');
const Messages = require('../src/messages');
const Wallet = require('../src/wallet');
const Bip44 = require('../src/bip44')

chai.should();
const expect = chai.expect;

function getPlatformIndexMap() {
  // Ref: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  let data = {
    'BTC': 0,
    'TESTNET': 1,
    'BCH': 145,
    'LTC': 2,
    'DOGE': 3,
    'DASH': 5,
    'NEO': 888,
    'ETH': 60,
    'ETC': 61,
    'ADA': 1815,
    'EOS': 194,
    'ONT': 1024,
    'OMNI': 200
  };

  // change to lower case
  Object.keys(data).forEach(item => {
    data[item.toLocaleLowerCase()] = data[item];
  });

  return data;
}

describe('bip44', async() => {

  describe('#getCoinIndex', async() => {

    it('should be error when null', async () => {
      expect(() => Bip44.getCoinIndex(null))
        .to.throw(AppError.create(Messages.invalid_parameter, 'platform').message);
    });

    it('should be error when undefined', async () => {
      expect(() => Bip44.getCoinIndex())
        .to.throw(AppError.create(Messages.invalid_parameter, 'platform').message);
    });

    it('should be success when get coin index', async () => {
      let data = getPlatformIndexMap();

      // Get & check coin type
      Object.keys(data).forEach(item => {
        let coinIndex = Bip44.getCoinIndex(item);
        expect(coinIndex).to.equal(data[item], `Coin type ${item} shoud be equal.`)
      });

      // Check number of platform
      expect(Object.keys(Bip44.BIP44).length)
        .to.equal(Object.keys(data).length / 2, 'all platform must be checked');
    });

  });

  describe('#getHDPath', async() => {

    it('get by platform name and default paramenters', async () => {
      let data = getPlatformIndexMap();

      // Get & check hd path
      Object.keys(data).forEach(item => {
        let hdPath = Bip44.getHDPath(item);
        expect(hdPath).to.equal(`m/44'/${data[item]}'/0'/0/0`, `HdPath ${item} shoud be equal.`)
      });
    });

    it('get by platform name and paramenters', async () => {
      let data = getPlatformIndexMap();

      // Get & check hd path
      Object.keys(data).forEach(item => {
        let hdPath = Bip44.getHDPath(item, 1, 2, 3);
        expect(hdPath).to.equal(`m/44'/${data[item]}'/1'/2/3`, `HdPath ${item} shoud be equal.`)
      });
    });

    it('get by customize coin index and default paramenters', async () => {
      let data = [100, 2019, 9999];
      data.forEach(item => {
        let hdPath = Bip44.getHDPath(item);
        expect(hdPath).to.equal(`m/44'/${item}'/0'/0/0`, `HdPath ${item} shoud be equal.`)
      });
    });

    it('get by customize coin index and paramenters', async () => {
      let data = [100, 2019, 9999];
      data.forEach(item => {
        let hdPath = Bip44.getHDPath(item, 4, 5, 6);
        expect(hdPath).to.equal(`m/44'/${item}'/4'/5/6`, `HdPath ${item} shoud be equal.`)
      });
    });

  });

});