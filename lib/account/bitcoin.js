const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const { AppError } = require('infinito-util');
const Bip39 = require('bip39');

class Account {
  /**
   * passPhrase: {
   *   mnemonic:'',
   *   index:0,
   *   hdPath:'m/44'/888'/0'/0/0'
   *   coinType:BTC
   * } 
   * privateKey
   */
  constructor(options) {
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }

    if (options.privateKey) {
      this.privateKey = options.privateKey;
    }
    else {
      let keys = Keychain.getKeysFromPassPhrase(options.passPhrase);
      this.privateKey = keys.privateKey;
    }
    let result = generateAccount(this.privateKey, options.isTestNet);
    Object.assign(this, result);
  }
}

function generateAccount(privateKey, isTestNet = false) {
  let network = isTestNet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
  const { address } = Bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey })
  return {
    address,
    privateKey,
    publicKey: keyPair.publicKey.toString('hex'),
    network,
    isTestNet,
    keyPair: keyPair
  };
};

module.exports = Account;