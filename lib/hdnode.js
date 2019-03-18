const Bip39 = require('bip39');
const Bip32 = require('bip32');
const BIP44 = require('./bip44');
const Util = require('util');
const { AppError } = require('node-infinito-util');
const Messages = require('./messages');
const CoinType = require('./coin_type');

const HDPATH_TESTNET = "m/44'/1'/0'/0/0";

class HDNode {
  /**
   * @constructor
   * @param  {String}  options.mnemonic        (optional) mnemonic
   * @param  {String}  options.hdPath          (optional) hdPath (based on standard BIP44)
   * @param  {String}  options.isTestnet       (optional) hdPath (based on standard BIP44)
   */
  constructor(options = {}) {

    if (options.mnemonic == null || options.mnemonic == undefined) {
      this.mnemonic = HDNode.generateMnemonic();
    } else {
      this.mnemonic = options.mnemonic;
    }

    this.isTestnet = (options.isTestnet == true);
    if (this.isTestnet) {
      this.hdPath = HDPATH_TESTNET;
    } else {
      if (options.hdPath == null || options.hdPath == undefined) {
        throw new AppError(
          Util.format(Messages.missing_parameter.message, 'hdPath'),
          Messages.missing_parameter.code
        );
      }
      options.hdPath = options.hdPath.trim();
      let parts = options.hdPath.split('/');
      if (parts.length != 6) {
        throw new AppError(
          Util.format(Messages.invalid_hdpath.message, options.hdPath),
          Messages.invalid_hdpath.code
        );
      }
      this.hdPath = options.hdPath;
    }
    this.hdPathArr = this.hdPath.split('/');
  }

  /**
   * @param  {String}  coinType                (required) Coin type (BTC|BCH...)
   * @param  {Number}  index                   (optional) index (based on standard BIP44)
   */
  generateKeyPair(coinType, index) {
    if (index < 0) {
      throw new AppError(
        Util.format(Messages.invalid_parameter.message, 'index'),
        Messages.invalid_parameter.code
      );
    }
    let network = HDNode.getNetwork(coinType, this.isTestnet);
    this.hdPathArr[5] = index;
    this.hdPath = this.hdPathArr.join('/');

    let seed = HDNode.mnemonicToSeed(this.mnemonic);
    let masterKeyPair = HDNode.createMasterKeyPair(seed, network);
    this.keypair = HDNode.createHDKeyPair(masterKeyPair, this.hdPath);
    return this.keypair;
  }

  /**
   * get hdpath
   * @returns {String}
   */
  getHDPath() {
      return this.hdPath;
    }
    /**
     * get wif
     * @returns {String}
     */
  getWif() {
    return this.keypair.toWIF();
  }

  /**
   * @returns {Buffer}
   */
  getPublicKey() {
    return this.keypair.publicKey;
  }

  /**
   * @returns {Buffer}
   */
  getPrivateKey() {
    return this.keypair.privateKey;
  }

  /**
   * @returns {String}
   */
  getMnemonic() {
    return this.mnemonic;
  }

  /**
   * @returns {String}
   */
  static generateMnemonic() {
    return Bip39.generateMnemonic();
  }

  /**
   * @param  {String} mnemonic          (required) mnemonic
   */
  static mnemonicToSeed(mnemonic) {
    return Bip39.mnemonicToSeed(mnemonic);
  }

  /**
   * Get hdpath by coin type
   *
   * @static
   * @param {String} coinType   (required) Testnet|BTC|BCH|LTC|DOGE|DASH|NEO|ETH|ETC|ADA|ONT
   * @returns
   * @memberof HDNode
   */
  static getHdPathByCoinType(coinType = '') {
    coinType = coinType.toUpperCase();
    if (coinType.toUpperCase() == 'TESTNET') {
      return HDPATH_TESTNET;
    }
    if (BIP44[coinType] === undefined || BIP44[coinType] < 0) {
      throw new AppError(
        Util.format(Messages.invalid_cointype.message, coinType),
        Messages.invalid_cointype.code
      );
    }
    let coinIndex = BIP44[coinType] - BIP44['BTC'];
    return `m/44'/${coinIndex}'/0'/0/0`;
  }

  /**
   * @param  {String} seed              (required) seed
   * @param  {Object} network           (required) Type network in networks.js
   */
  static createMasterKeyPair(seed, network) {
    return Bip32.fromSeed(seed, network);
  }

  /**
   * @param  {String}  master              (required) master
   * @param  {String}  hdPath              (required) index (based on standard BIP44)
   * @returns {Object} Keypair
   */
  static createHDKeyPair(master, hdPath) {
    return master.derivePath(hdPath);
  }

  /**
   * @static
   * @param   {String}  coinType          (required) Coin type (BTC|BCH...)
   * @param   {Boolean} isTestnet         (optional) Environment type (default = false))
   * @returns {Object}  Type network in networks.js
   */
  static getNetwork(coinType, isTestnet = false) {
    let network;
    switch (coinType) {
      case CoinType.BTC.symbol:
        {
          network = isTestnet ?
          CoinType.BTC.network.testnet : CoinType.BTC.network.mainnet;
          break;
        }
      case CoinType.BCH.symbol:
        {
          network = isTestnet ?
          CoinType.BCH.network.testnet : CoinType.BCH.network.mainnet;
          break;
        }
      case CoinType.LTC.symbol:
        {
          network = isTestnet ?
          CoinType.LTC.network.testnet : CoinType.LTC.network.mainnet;
          break;
        }
      case CoinType.DASH.symbol:
        {
          network = isTestnet ?
          CoinType.DASH.network.testnet : CoinType.DASH.network.mainnet;
          break;
        }
      case CoinType.DOGE.symbol:
        {
          network = isTestnet ?
          CoinType.DOGE.network.testnet : CoinType.DOGE.network.mainnet;
          break;
        }
      default:
        network = CoinType.BTC.network.mainnet;
        break;
    }

    return network;
  }
}

module.exports = HDNode;