const Bitcoinjs = require('bitcoinjs-lib');

const coinType = {
  BTC: {
    symbol: 'BTC',
    coin: 'Bitcoin',
    network: {
      mainnet: Bitcoinjs.networks.bitcoin,
      testnet: Bitcoinjs.networks.testnet
    }
  },
  BCH: {
    symbol: 'BCH',
    coin: 'Bitcoin Cash',
    network: {
      mainnet: Bitcoinjs.networks.bitcoin,
      testnet: Bitcoinjs.networks.testnet
    }
  },
  LTC: {
    symbol: 'LTC',
    coin: 'Litecoin',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  DOGE: {
    symbol: 'DOGE',
    coin: 'Dogecoin',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  DSH: {
    symbol: 'DSH',
    coin: 'Dash',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  ETH: {
    symbol: 'ETH',
    coin: 'Ether',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  ETC: {
    symbol: 'ETC',
    coin: 'Ether Classic',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  RSK: {
    symbol: 'RSK',
    coin: 'RSK',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  EOS: {
    symbol: 'EOS',
    coin: 'EOS',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  NEO: {
    symbol: 'NEO',
    coin: 'NEO',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  ADA: {
    symbol: 'ADA',
    coin: 'Cardano',
    network: {
      mainnet: {},
      testnet: {}
    }
  }
}

module.exports = coinType;
