const CoinType = require('../coin_type');
const Neon = require('@cityofzion/neon-js');
const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const HdNode = require('../hdnode');
const wif = require('wif');

class NeoAccount {
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

    this.coinType = CoinType.NEO.symbol;
    let result = generateAccount(wifkey, network, options.isTestNet);
    Object.assign(this, result);
  }

  validateAddress(address) {
    return Neon.wallet.isAddress(address);
  }
}

function generateAccount(privateKey, network, isTestNet = false) {
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
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