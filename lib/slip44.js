const slip44 = {
  BTC: {
    index: 0,
    symbol: 'BTC',
    hexa: '0x800000000',
    coin: 'Bitcoin'
  },
  TESTNET: {
    index: 1,
    symbol: '',
    hexa: '0x800000001',
    coin: 'Testnet (all coin)'
  },
  LTC: {
    index: 2,
    symbol: '',
    hexa: '0x800000002',
    coin: 'Litecoin'
  },
  DOGE: {
    index: 3,
    symbol: '',
    hexa: '0x800000003',
    coin: 'Dogecoin'
  },
  DSH: {
    index: 5,
    symbol: '',
    hexa: '0x800000005',
    coin: 'Dash'
  },
  ETH: {
    index: 60,
    symbol: '',
    hexa: '0x80000003c',
    coin: 'Ether'
  },
  ETC: {
    index: 61,
    symbol: '',
    hexa: '0x80000003d',
    coin: 'Ether Classic'
  },
  SBTC: {
    index: 137,
    symbol: '',
    hexa: '0x800000089',
    coin: 'RSK'
  },
  BCH: {
    index: 145,
    symbol: '',
    hexa: '0x800000091',
    coin: 'Bitcoin Cash'
  },
  EOS: {
    index: 194,
    symbol: '',
    hexa: '0x8000000c2',
    coin: 'EOS'
  },
  NEO: {
    index: 888,
    symbol: '',
    hexa: '0x800000378',
    coin: 'NEO'
  },
  ADA: {
    index: 1815,
    symbol: '',
    hexa: '0x800000717',
    coin: 'Cardano'
  }
};

module.exports = slip44;