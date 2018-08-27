const EthWallet = require('ethereumjs-wallet');
const Keychain = require('../keychain');
const { AppError } = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const EthUtil = require('ethereumjs-util');

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
  let ethWallet = EthWallet.fromPrivateKey(EthUtil.toBuffer(privateKey));
  return {
    address: ethWallet.getAddressString(),
    privateKey: ethWallet.getPrivateKeyString(),
    publicKey: ethWallet.getPublicKeyString(),
    isTestNet: isTestNet
  };
};

module.exports = EthAccount;