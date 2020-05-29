const WalletE = require("ethereumjs-wallet");
const Web3 = require("web3");
const { Wallet, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./tomo.tx_builder');
const Messages = require('./messages');

/**
 * Tomo wallet
 *
 * @class TomoWallet
 * @extends {Wallet}
 */
class TomoWallet extends Wallet {

  /**
   * Creates an instance of TomoWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @memberof TomoWallet
   */
  constructor(privateKey, network) {
    super(privateKey);
    this.network = network;
    this.TEST_NET_WEB_SOCKET = "wss://testnet.tomochain.com/ws";
    this.MAIN_NET_WEB_SOCKET = "wss://ws.tomochain.com";
    
    this.__init();
  }

  /**
   * Init wallet from private key and network
   *
   * @param {Buffer} privateKey
   * @memberof TomoWallet
   */
  __init() {
    if (!this.privateKey) {
      throw AppError.create(Messages.missing_parameter, 'privateKey');
    }

    const wallet = WalletE.fromPrivateKey(this.privateKey);
    this.publicKey = wallet.getPublicKeyString().toString("hex");
    this.address = wallet.getAddressString();
    this.wif = this.privateKey;
    this.keyPair = { privateKey: this.privateKey, publicKey: this.publicKey };
  }

  /**
   * Get public key
   *
   * @returns
   * @memberof Wallet
   */
  getPublicKey() {
    return this.publicKey;
  }

  /**
   * Get address
   *
   * @returns
   * @memberof Wallet
   */
  getAddress() {
    return this.address;
  }

  /**
   * Get address
   *
   * @returns
   * @memberof Wallet
   */
  getWif() {
    return this.wif;
  }

  /**
   * Get keypair
   *
   * @returns
   * @memberof TomoWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof TomoWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Get Web3
   */
  getTomoWeb3() {
    return new Web3(this.isTestnet ? this.TEST_NET_WEB_SOCKET : this.MAIN_NET_WEB_SOCKET);
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof TomoWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    return this.getTomoWeb3().eth.accounts.sign(msg, this.privateKey);
  }

}

module.exports = TomoWallet;