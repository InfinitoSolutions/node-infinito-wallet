const Cardano = require("./cardano-wallet/cardano_wallet");
const { Wallet, AppError } = require('infinito-wallet-core');
const TransactionBuilder = require('./ada.tx_builder');
const Messages = require('./messages');

/**
 * Ada wallet
 *
 * @class AdaWallet
 * @extends {Wallet}
 */
class AdaWallet extends Wallet {

  /**
   * Creates an instance of AdaWallet.
   * @param {Buffer|String} privateKey Private key: 64 characters hex string or 32 bytes buffer. Wif is 52 characters
   * @memberof AdaWallet
   */
  constructor(privateKey, network, mnemonic) {
    super(privateKey);
    this.network = network;
    this.mnemonic = mnemonic;
    
    this.__init();
  }

  /**
   * Init wallet from private key and network
   *
   * @param {Buffer} privateKey
   * @memberof AdaWallet
   */
  __init() {
    if (!this.privateKey) {
      throw AppError.create(Messages.missing_parameter, 'privateKey');
    }

    // to connect the wallet to mainnet
    let settings = Cardano.BlockchainSettings.mainnet();

    // recover the entropy
    let entropy = Cardano.Entropy.from_english_mnemonics(this.mnemonic);
    // recover the wallet
    let wallet = Cardano.Bip44RootPrivateKey.recover(entropy);

    // create a wallet account
    let account = wallet.bip44_account(Cardano.AccountIndex.new(0 | 0x80000000));
    let account_public = account.public();

    // create an address
    let chain_pub = account_public.bip44_chain(false);
    let key_pub = chain_pub.address_key(Cardano.AddressKeyIndex.new(0));
    let address = key_pub.bootstrap_era_address(settings);

    this.address = address.to_base58();
    this.publicKey = this.address;
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
   * @memberof AdaWallet
   */
  getKeyPair() {
    return this.keyPair;
  };

  /**
   * Create transaction builder instance
   *
   * @returns
   * @memberof AdaWallet
   */
  newTxBuilder() {
    return new TransactionBuilder()
      .useWallet(this);
  }

  /**
   * Sign transaction
   *
   * @param {*} msg
   * @memberof AdaWallet
   */
  signTx(msg) {
    if (msg == null || msg === undefined) {
      throw AppError.create(Messages.missing_parameter, 'msg');
    }

    return msg;
  }

}

module.exports = AdaWallet;