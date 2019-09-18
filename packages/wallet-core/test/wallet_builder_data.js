const Networks = require('../src/networks');

module.exports = [
  {
    name: 'case 1',
    config: {},
    expected: {
      exception: 'Missing required parameter platform'
    }
  },
  {
    name: 'case 2',
    config: {
      platform: 'BTC',
      mnemonic: 'hero winter afford grief modify pave night baby harvest rug cave trick',
      testnet: false
    },
    expected: {
      privateKey: '3aefb58ac6e966ff2e04fc76a29b7fc673cc92e32bac7dbcb82b92fd9a66b10a',
      network: Networks.getNetwork('BTC', false)
    }
  },
];