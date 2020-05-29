const Messages = require('./messages');
const AppError = require('./app_error');

/**
 * BIP44 Index
 * https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
const BIP44 = {
  BTC: 0x80000000,
  TESTNET: 0x80000001,
  BCH: 0x80000091,
  LTC: 0x80000002,
  DOGE: 0x80000003,
  DASH: 0x80000005,
  NEO: 0x80000378,
  ETH: 0x8000003c,
  ETC: 0x8000003d,
  ADA: 0x80000717,
  EOS: 0x800000c2,
  ONT: 0x80000400,
  OMNI: 0x800000c8,
  BNB: 0x800002ca,
  COSMOS: 0x800002ca,
  IRIS: 0x800002ca,
  TOMO: 0x80000379,
  TRX: 0x800000c3,
  FIO: 0x800000eb
};

/**
 * Get BIP44 coin index by platform 
 *
 * @param {*} platform
 * @returns
 */
function getCoinIndex(platform) {
  if (typeof (platform) === 'string') {
    platform = platform.toUpperCase();
  }

  if (BIP44[platform] === undefined) {
    throw AppError.create(Messages.invalid_parameter, 'platform');
  }
  return BIP44[platform] - BIP44['BTC'];
}

/**
 * Get hdpath
 * https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 *
 * @param {String|Integer} platform
 * @returns
 */
function getHDPath(platform, account = 0, chain = 0, address = 0) {
  let coinIndex = platform;
  if (typeof (platform) === 'string')
    coinIndex = getCoinIndex(platform);

  return `m/44'/${coinIndex}'/${account}'/${chain}/${address}`;
}

module.exports = {
  BIP44,
  getCoinIndex,
  getHDPath
};