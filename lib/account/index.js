const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const { AppError } = require('infinito-util');

class Account {

  /**
   * passPhrase: {
   *   mnemonic:'',
   *   index:0,
   *   hdPath:'m/44'/888'/0'/0'
   * } 
   * privateKey
   * coinType
   */
  constructor(options) {
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }

    if (!privateKey) {
      this.privateKey = privateKey;
    }
    else {
      let keys = Keychain.getKeys(options.passPhrase);
      this.privateKey = keys.privateKey;
      this.publicKey = keys.publicKey;
    }

    let result = generateAccount(this.privateKey, options.isTestNet);
    Object.assign(this, ...result);
  }
}


function generateAccount(privateKey, isTestNet) {
  let network = isTestNet ? Bitcoinjs.networks.testnet : Bitcoinjs.networks.bitcoin;
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);
  const { address } = Bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey })
  return {
    address,
    network,
    isTestNet
  };
};

module.exports = Account;