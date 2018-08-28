const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const HdNode = require('../hdnode');
const wif = require('wif')

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
    let network = HdNode.getNetwork(options.coinType, options.isTestNet);
    let wifkey;
    if (options.privateKey) {
      wifkey = Keychain.getWif(options.privateKey, network);
    } else {
      let keys = Keychain.getKeyPairFromPassPhrase({
        mnemonic: options.mnemonic,
        hdPath: options.hdPath,
        coinType: options.coinType,
        index: options.index,
        isTestNet: options.isTestNet
      });

      wifkey = wif.encode(network.wif, keys.privateKey, true);
    }

    this.coinType = options.coinType;
    let result = generateAccount(wifkey, network, options.isTestNet);
    Object.assign(this, result);
  }

}

function generateAccount(privateKey, network, isTestNet = false) {
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);

  let { address } = Bitcoinjs.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: network
  });
  return {
    address,
    privateKey: keyPair.privateKey.toString('hex'),
    publicKey: keyPair.publicKey.toString('hex'),
    network,
    isTestNet,
    keyPair: keyPair
  };
}

module.exports = BitcoinAccount;