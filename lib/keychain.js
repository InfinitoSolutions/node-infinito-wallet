const Bitcoinjs = require('bitcoinjs-lib');
const Bip39 = require('bip39');
const Bip32 = require('bip32');

class Keychain {
  constructor() {
  }

  createFromPrivateKey(privateKey, isTestNet) {
    let network = isTestNet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
    let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
    const { address } = Bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey })
    return {

      privateKey,
      isTestNet
    };
  };

  createFromSeed(seed, isTestNet) {
    const network = isTestNet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
    const hdPathString = isTestNet ? "m/44'/60'/0'/0" : "m/44'/60'/0'/0";
    const masterSeed = Bip39.mnemonicToSeed(seed);
    const root = Bip32.fromSeed(masterSeed);
    const node = root.derivePath(hdPathString);

    const { address } = Bitcoinjs.payments.p2pkh({ pubkey: node.publicKey, network });
    return {
      addr: address,
      privateKey: node.toWIF(),
      isTestNet
    };
  };

  generateKey() {

  }
}

console.log('testnet:' + JSON.stringify(Bitcoinjs.networks.testnet))
var factory = new Factory();
var result = factory.createFromPrivateKey('92Pg46rUhgTT7romnV7iGW6W1gbGdeezqdbJCzShkCsYNzyyNcc', true);
console.log(result);

const mnemonic = Bip39.generateMnemonic();
var result = factory.createFromSeed(mnemonic, true);
console.log('createFromSeed:' + JSON.stringify(result)); 