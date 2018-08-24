const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const { AppError } = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const CoinType = require('../support_coin');

const defaultFeePerB = 50;

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

    this.coinType = options.coinType;
    let result = generateAccount(this.privateKey, options.isTestNet);
    Object.assign(this, result);
  }
}

function generateAccount(privateKey, isTestNet = false) {
  let network = isTestNet ? CoinType.BTC.network.testnet : CoinType.BTC.network.mainnet;
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
  const { address } = Bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: network })
  return {
    address,
    privateKey,
    publicKey: keyPair.publicKey.toString('hex'),
    network,
    isTestNet,
    keyPair: keyPair
  };
};

module.exports = BitcoinAccount;