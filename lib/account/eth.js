const EthWallet = require('ethereumjs-wallet');
const HdKey = require('ethereumjs-wallet/hdkey');
const Keychain = require('../keychain');
const HdNode = require('../hdnode');
const { AppError } = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const HdPathDefault = "m/44'/60'/0'/0";
const EthUtil = require('ethereumjs-util');

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
      let result = generateAccountFromPrivate(this.privateKey, options.isTestNet);
      Object.assign(this, result);
    }
    else {
      let result = generateAccountFromHdPath(options.mnemonic, options.hdPath, options.isTestNet);
      Object.assign(this, result);
    }
    this.coinType = options.coinType;
  }
}

function generateAccountFromHdPath(mnemonic, hdPath, isTestNet = false, child = 0) {
  let node = new HdNode();
  if (!mnemonic) {
    mnemonic = node.generateMnomenic();
  }
  let masterSeed = node.mnemonicToSeed(mnemonic);
  let _wallet = HdKey.fromMasterSeed(masterSeed).derivePath(hdPath || HdPathDefault).deriveChild(child || 0).getWallet();
  return {
    address: _wallet.getAddressString(),
    privateKey: _wallet.getPrivateKeyString(),
    publicKey: _wallet.getPublicKeyString(),
    isTestNet
  };
}

function generateAccountFromPrivate(privateKey, isTestNet = false) {
  let ethWallet = EthWallet.fromPrivateKey(EthUtil.toBuffer(privateKey));
  return {
    address: ethWallet.getAddressString(),
    privateKey: ethWallet.getPrivateKeyString(),
    publicKey: ethWallet.getPublicKeyString(),
    isTestNet
  };
};

module.exports = EthAccount;