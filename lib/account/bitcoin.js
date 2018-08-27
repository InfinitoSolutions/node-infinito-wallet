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

    if (options.privateKey || options.wif) {
      this.privateKey = options.privateKey;
      this.wif = options.wif;
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
    let result = null;
    if (this.wif) {
      result = generateAccount(this.wif, true, options.isTestNet);
      this.privateKey = result.privateKey;
    } else
      result = generateAccount(this.privateKey, false, options.isTestNet);
    Object.assign(this, result);
  }

  getWif() {
    let keyPair = Bitcoinjs.ECPair.fromPrivateKey(this.privateKey);
    return keyPair.toWIF();
  }
}

function generateAccount(privateKey, isWif, isTestNet = false) {
  let keyPair = null;
  let network = isTestNet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
  if (isWif)
    keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
  else
    keyPair = Bitcoinjs.ECPair.fromPrivateKey(privateKey);

  let {
    address
  } = Bitcoinjs.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: network
  })
  return {
    address: address,
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
    isTestNet: isTestNet
  };
};

module.exports = BitcoinAccount;