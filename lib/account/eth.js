const EthWallet = require('ethereumjs-wallet');
const Keychain = require('../keychain');
const { AppError } = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');

class EthAccount {
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
    console.log(options);
    if (options.privateKey) {
      this.privateKey = options.privateKey;
    }
    else {
      let keys = Keychain.getKeysFromPassPhrase({
        mnemonic: options.mnemonic,
        hdPath: options.hdPath,
        coinType: options.coinType,
        index: options.index,
        isTestNet: options.isTestNet
      });
      this.privateKey = keys.privateKey;
    }
    console.log(this);
    this.coinType = options.coinType;
    let result = generateAccount(this.privateKey, options.coinType, options.isTestNet);
    Object.assign(this, result);
  }
}

function generateAccount(privateKey, coinType, isTestNet = false) {
  let network = Keychain.getNetwork(coinType, isTestNet);;
  let ethWallet = EthWallet.fromPrivateKey(privateKey);

  return {
    address: ethWallet.getAddressString(),
    privateKey: ethWallet.getPrivateKeyString(),
    publicKey: ethWallet.getPublicKeyString(),
    network,
    isTestNet
  };
};

module.exports = EthAccount;