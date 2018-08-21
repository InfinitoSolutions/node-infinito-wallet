const BIP39 = require('bip39');
const Bitcoin = require('bitcoinjs-lib');

class Factory {
  constructor() {
    // init environment
  }

  genMnemonic() {
    return mnemonic = BIP39.generateMnemonic();
  }

  mnemonicToSeed(mnemonic) {
    return BIP39.mnemonicToSeed(mnemonic);
  }

  getMasterKeys(seed, network) {
    return Bitcoin.HDNode.fromSeedBuffer(seed, network);
  }
}

var factory = new Factory();
var mnemonic = factory.genMnemonic();
var seed = factory.mnemonicToSeed(mnemonic);
var masterKeys = factory.getMasterKeys(seed, Bitcoin.networks.bitcoin);
console.log(masterKeys);