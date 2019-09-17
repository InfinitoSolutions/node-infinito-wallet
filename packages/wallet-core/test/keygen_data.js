const Networks = require('../src/networks')

const NETWORK_BTC_MAINNET = Networks.getNetwork('BTC', false);
const NETWORK_BTC_TESTNET = Networks.getNetwork('BTC', true);
const HDPATH_MAINNET = "m/44'/0'/0'/0/0";
const HDPATH_TESTNET = "m/44'/1'/0'/0/0";

// platform	privateKey wif mnemonic password hdPath testnet
module.exports = [
  {
    name: "case 65",
    config: {
      platform: "BTC",
      testnet: false
    },
    expected: {
      exception: "Missing required parameter mnemonic"
    }
  },
  {
    name: "case 66",
    config: {
      platform: "BTC",
      testnet: true
    },
    expected: {
      exception: "Missing required parameter mnemonic"
    }
  },
  {
    name: "case 67",
    config: {
      platform: "BTC",
      hdPath: HDPATH_MAINNET,
      testnet: false
    },
    expected: {
      exception: "Missing required parameter mnemonic"
    }
  },
  {
    name: "case 68",
    config: {
      platform: "BTC",
      hdPath: HDPATH_MAINNET,
      testnet: true
    },
    expected: {
      exception: "Missing required parameter mnemonic"
    }
  },
  {
    name: "case 69",
    config: {
      platform: "BTC",
      password: "123456",
      testnet: false
    },
    expected: {
      exception: "Missing required parameter mnemonic"
    }
  },
  {
    name: "case 70",
    config: {
      platform: "BTC",
      password: "123456",
      testnet: true
    },
    expected: {
      exception: "Missing required parameter mnemonic"
    }
  },
  {
    name: "case 71",
    config: {
      platform: "BTC",
      password: "123456",
      hdPath: HDPATH_MAINNET,
      testnet: false
    },
    expected: {
      exception: "Missing required parameter mnemonic"
    }
  },
  {
    name: "case 72",
    config: {
      platform: "BTC",
      password: "123456",
      hdPath: HDPATH_MAINNET,
      testnet: true
    },
    expected: {
      exception: "Missing required parameter mnemonic"
    }
  },
  {
    name: "case 73",
    config: {
      platform: "BTC",
      mnemonic: "festival danger night twice shy neither blur describe once pretty bird scale",
      testnet: false
    },
    expected: {
      privateKey: "db95008e70c0f681db0b400c1a21cecbb9189413f46ee4232b9057bc1ccce85d",
      publicKey: "02c7f2713dd4f82419ba0caa13e44a88b59e215826facc9a02d177917f0d7778a6",
      network: NETWORK_BTC_MAINNET
    }
  },
  {
    name: "case 74",
    config: {
      platform: "BTC",
      mnemonic: "festival danger night twice shy neither blur describe once pretty bird scale",
      testnet: true
    },
    expected: {
      privateKey: "4679533d1dbee532c6d26c4134db8e5a8cd3bb10549977141e162590f1264e83",
      publicKey: "030bc4a696c00e6a4871410a23fc9815d088badd71ba747c56ceca71ed64ad8e67",
      network: NETWORK_BTC_TESTNET
    }
  },
  {
    name: "case 75",
    config: {
      platform: "BTC",
      mnemonic: "festival danger night twice shy neither blur describe once pretty bird scale",
      testnet: false,
      hdPath: HDPATH_MAINNET,
    },
    expected: {
      privateKey: "db95008e70c0f681db0b400c1a21cecbb9189413f46ee4232b9057bc1ccce85d",
      publicKey: "02c7f2713dd4f82419ba0caa13e44a88b59e215826facc9a02d177917f0d7778a6",
      network: NETWORK_BTC_MAINNET
    }
  },
  {
    name: "case 76",
    config: {
      platform: "BTC",
      mnemonic: "festival danger night twice shy neither blur describe once pretty bird scale",
      testnet: true,
      hdPath: HDPATH_TESTNET,
    },
    expected: {
      privateKey: "4679533d1dbee532c6d26c4134db8e5a8cd3bb10549977141e162590f1264e83",
      publicKey: "030bc4a696c00e6a4871410a23fc9815d088badd71ba747c56ceca71ed64ad8e67",
      network: NETWORK_BTC_TESTNET
    }
  },
  {
    name: "case 76",
    config: {
      platform: "BTC",
      mnemonic: "festival danger night twice shy neither blur describe once pretty bird scale",
      password: "123abc!@#",
      testnet: false
    },
    expected: {
      privateKey: "db95008e70c0f681db0b400c1a21cecbb9189413f46ee4232b9057bc1ccce85d",
      publicKey: "02c7f2713dd4f82419ba0caa13e44a88b59e215826facc9a02d177917f0d7778a6",
      network: NETWORK_BTC_MAINNET
    }
  },
];