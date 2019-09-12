const Bitcoinjs = require('bitcoinjs-lib');
const { Wallet, Networks, Keygen, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./btc.tx_builder');
const Messages = require('./messages');

/**
 * Bitcoin wallet
 *
 * @class BtcWallet
 * @extends {Wallet}
 */
class BtcWallet extends Wallet {

  /**
   * Creates an instance of BtcWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @param {Network} network
   * @memberof BtcWallet
   */
  constructor(privateKey, network) {
    super(privateKey);
    this.network = (network === null || network === undefined) ? Networks.getNetwork('BTC') : network;
    this.__init(this.privateKey, this.network);
  }

  /**
   * Init wallet from private key and network
   *
   * @param {Buffer} privateKey
   * @param {Network} network
   * @memberof BtcWallet
   */
  __init(privateKey, network) {
    let wif = Keygen.privateKeytoWif(privateKey, network.wif);
    let keyPair = Bitcoinjs.ECPair.fromWIF(wif.toString('hex'), network);
    let { address } = Bitcoinjs.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: network
    });

    this.address = address;
    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;
    this.wif = wif;
    this.keyPair = keyPair;
  }

  /**
   * Get network
   *
   * @returns
   * @memberof BtcWallet
   */
  getNetwork() {
    return this.network;
  }

  /**
   * Get keypair
   *
   * @returns
   * @memberof BtcWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof BtcWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Sign message
   *
   * @param {*} msg
   * @memberof BtcWallet
   */
  signMessage(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }
    // TODO
    console.log('BTC.sendMessage');
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof BtcWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    let txBuilder = null;
    if (typeof (msg) === 'object' && msg.constructor.name === 'TransactionBuilder') {
      txBuilder = msg;
    } else if (typeof (msg) === 'string') {
      let tx = Bitcoinjs.Transaction.fromHex(msg);
      txBuilder = Bitcoinjs.TransactionBuilder.fromTransaction(tx, this.network);
    }

    for (let i = 0; i < txBuilder.__inputs.length; i++) {
      txBuilder.sign(i, this.keyPair);
    }

    let tx = txBuilder.build();
    return {
      raw: tx.toHex(),
      tx_id: tx.getId()
    }
  }

}

module.exports = BtcWallet;