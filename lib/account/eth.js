const EthWallet = require('ethereumjs-wallet');
const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');

class EthAccount {
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
}

function generateAccount(privateKey, isTestNet = false) {
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, Bitcoinjs.networks.bitcoin);
  let ethWallet = EthWallet.fromPrivateKey(keyPair.privateKey);
  return {
    address: ethWallet.getAddressString(),
    privateKey: ethWallet.getPrivateKeyString(),
    publicKey: ethWallet.getPublicKeyString(),
    isTestNet
  };
};

module.exports = EthAccount;