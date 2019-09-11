const Blockchains = require('./blockchains');

const networks = {
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  testnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  dash: {
    messagePrefix: '\x19Dash Signed Message:\n',
    bip32: {
      public: 0x02fe52f8,
      private: 0x02fe52cc
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc,
    dustThreshold: 5460 // https://github.com/dashpay/dash/blob/master/src/primitives/transaction.h
  },
  dashTestnet: {
    messagePrefix: '\x19Dash Signed Message:\n',
    bip32: {
      public: 0x02fe52f8,
      private: 0x02fe52cc
    },
    pubKeyHash: 140,
    scriptHash: 19,
    wif: 0xcc,
    dustThreshold: 5460 // https://github.com/dashpay/dash/blob/master/src/primitives/transaction.h
  },
  dogecoin: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
    dustThreshold: 0 // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
  },
  dogecoinTestnet: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398
    },
    pubKeyHash: 0x71,
    scriptHash: 0xc4,
    wif: 0x9e,
    dustThreshold: 0 // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
  },
  litecoin: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  },
  litecoinTestnet: {
    messagePrefix: '\x18Litecoin Signed Message:\n',
    bip32: {
      public: 0x0436ef7d,
      private: 0x0436f6e1
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    dustThreshold: 100000
  }
};

/**
 * Get network by platform
 *
 * @param {String} platform BTC, BCH, LTC, DOGE, DASH
 * @param {Boolean} isTestnet True|False
 * @returns
 */
function getNetwork(platform, isTestnet = false) {
  let network = null;
  switch (platform) {
    case Blockchains.BTC:
      network = isTestnet ? networks.testnet : networks.bitcoin;
      break;
    case Blockchains.BCH:
      network = isTestnet ? networks.testnet : networks.bitcoin;
      break;
    case Blockchains.LTC:
      network = isTestnet ? networks.litecoinTestnet : networks.litecoin;
      break;
    case Blockchains.DOGE:
      network = isTestnet ? networks.dogecoinTestnet : network.dogecoin;
      break;
    case Blockchains.DASH:
      network = isTestnet ? networks.dashTestnet : network.dashTestnet;
      break;
    default:
      network = null;
      break;
  }
  return network;
}

module.exports = {
  Networks: networks,
  getNetwork
};