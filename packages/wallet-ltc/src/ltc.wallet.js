const Bitcoinjs = require('bitcoinjs-lib');
// const Wallet = require('../core/wallet');
// const Networks = require('../core/networks');
// const Keygen = require('../core/keygen');
const Wallet = require('../../wallet-core/src/wallet');
const Networks = require('../../wallet-core/src/networks');
const Keygen = require('../../wallet-core/src/keygen');
const TransactionBuilder = require('./ltc.tx_builder');
const { BtcWallet } = require('infinito-wallet-btc');

/**
 * Litecoin wallet
 *
 * @class LtcWallet
 * @extends {Wallet}
 */
class LtcWallet extends BtcWallet {

  /**
   * Creates an instance of LtcWallet.
   * @param {Buffer|String} privateKey
   * @param {Network} network
   * @memberof LtcWallet
   */
  constructor(privateKey, network) {
    super(privateKey);
    if (network == null || network == undefined) {
      this.network = Networks.getNetwork('LTC');
    } else {
      this.network = network;
    }
    this.__init(this.privateKey, this.network);
  }

  // /**
  //  * Init wallet from private key and network
  //  *
  //  * @param {Buffer} privateKey
  //  * @param {Network} network
  //  * @memberof BtcWallet
  //  */
  // __init(privateKey, network) {
  //   let wif = Keygen.getWif(privateKey, network.wif);

  //   let keyPair = Bitcoinjs.ECPair.fromWIF(wif.toString('hex'), network);
  //   let { address } = Bitcoinjs.payments.p2pkh({
  //     pubkey: keyPair.publicKey,
  //     network: network
  //   });

  //   this.address = address;
  //   this.privateKey = keyPair.privateKey;
  //   this.publicKey = keyPair.publicKey;
  //   this.wif = wif;
  //   this.keyPair = keyPair;
    
  //   console.log('Init BTC wallet:', {
  //     keyPair,
  //     address: this.address,
  //     privateKey : this.privateKey.toString('hex'),
  //     publickey : this.publicKey.toString('hex'),
  //     wif: this.wif.toString('hex')
  //   });
  // }

  // /**
  //  * Get network
  //  *
  //  * @returns
  //  * @memberof BtcWallet
  //  */
  // getNetwork() {
  //   return this.network;
  // }

  // /**
  //  * Get keypair
  //  *
  //  * @returns
  //  * @memberof BtcWallet
  //  */
  // getKeyPair() {
  //   return this.keyPair;
  // };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof BtcWallet
   */
  // newTransactionBuilder() {
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  // /**
  //  * Sign message
  //  *
  //  * @param {*} msg
  //  * @memberof BtcWallet
  //  */
  // signMessage(msg) {
  //   console.log('BTC.sendMessage');
  // }

  // /**
  //  * Sign transaction
  //  *
  //  * @param {*} msg
  //  * @memberof BtcWallet
  //  */
  // signTx(msg) {
  //   console.log('BTC.signTx');
  // }

  // send(addr, amount) {
  //   this.newTxBuilder()
  //       .addOutput("aa", "1")
  //       .addOutput("aa", "1")
  //       .addOutput("aa", "1")
  //       .createTx()
  //       .sign()
  //       .send()
  // }

  // send(raw | txBuilder)
}

module.exports = LtcWallet;