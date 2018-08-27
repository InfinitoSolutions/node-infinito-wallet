const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const CoinType = require('../support_coin');

class BitcoinAccount {
  /** 
   * options.mnemonic,
   * options.index,
   * options.hdPath,
   * options.privateKey,
   * options.coinType
   * options.isTestNet
   */
  constructor(options) {
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }

    if (options.privateKey) {
      this.privateKey = options.privateKey;
    } else {
      let keys = Keychain.getKeyPairFromPassPhrase({
        mnemonic: options.mnemonic,
        hdPath: options.hdPath,
        coinType: options.coinType,
        index: options.index,
        isTestNet: options.isTestNet
      });
      this.privateKey = keys.privateKey;
    }

    this.coinType = options.coinType;
    let result = generateAccount(this.privateKey, options.isTestNet);
    Object.assign(this, result);
  }

  getWif() {
    let keyPair = Bitcoinjs.ECPair.fromPrivateKey(this.privateKey);
    return keyPair.toWIF();
  }
}

function generateAccount(privateKey, isTestNet = false) {
  let keyPair = Bitcoinjs.ECPair.fromPrivateKey(privateKey);
  let network = isTestNet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
  let {
    address
  } = Bitcoinjs.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: network
  })
  return {
    address,
    privateKey,
    publicKey: keyPair.publicKey,
    isTestNet: isTestNet
  };
};

module.exports = BitcoinAccount;