const CoinType = require('../coin_type');
const Neon = require('@cityofzion/neon-js');
const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');

class NeoAccount {
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
        coinType: CoinType.NEO.symbol,
        index: options.index
      });
      this.privateKey = keys.privateKey;
    }

    this.coinType = CoinType.NEO.symbol;
    let result = generateAccount(this.privateKey);
    Object.assign(this, result);
  }

  validateAddress(address) {
    return Neon.wallet.isAddress(address);
  }

  getWif() {
    let keyPair = Bitcoinjs.ECPair.fromPrivateKey(this.privateKey);
    return keyPair.toWIF();
  }
}

function generateAccount(privateKey, isTestNet = false) {
  let keyPair = Bitcoinjs.ECPair.fromPrivateKey(privateKey);
  let script = Neon.wallet.getScriptHashFromPublicKey(keyPair.publicKey.toString('hex'));
  let address = Neon.wallet.getAddressFromScriptHash(script);
  return {
    address,
    privateKey,
    publicKey: keyPair.publicKey,
    isTestNet: isTestNet
  };
}

module.exports = NeoAccount;