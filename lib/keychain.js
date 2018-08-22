const Bitcoinjs = require('bitcoinjs-lib');
const Bip39 = require('bip39');
const Bip32 = require('bip32');

class Keychain {
  static createFromPrivateKey(privateKey, isTestNet) {
    let network = isTestNet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
    let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
    const { address } = Bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey })
    return {
      privateKey,
      isTestNet
    };
  };

  static createFromSeed(seed, isTestNet) {
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

  static getKeys(passphrase) {

  }
}

module.exports = Keychain;