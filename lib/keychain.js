const HdNode = require('./hdnode');
const wif = require('wif');

class Keychain {
  /**
   * @static
   * @param  {Object}  params
   * @param  {String}  params.mnemonic        (optional) mnemonic
   * @param  {String}  params.hdPath          (optional) hdPath (based on standard BIP44)
   * @param  {Number}  params.index           (optional) index (based on standard BIP44)
   * @param  {String}  params.coinType        (required) Coin type (BTC|BCH...)
   * @param  {Boolean} params.isTestNet       (optional) Environment type (default = false)
   * @returns {Object} return Keys {privateKey:'', publicKey:''}
   */
  static getKeyPairFromPassPhrase({
    mnemonic,
    hdPath,
    coinType = '',
    index = 0,
    isTestNet = false
  }) {

    if (!hdPath) {
      hdPath = HdNode.getHdPathByCoinType(isTestNet ? 'TESTNET' : coinType);
    }
    let node = new HdNode({
      mnemonic,
      isTestNet,
      hdPath
    });
    node.generateKeyPair(coinType, index);
    return {
      privateKey: node.getPrivateKey(),
      publicKey: node.getPublicKey()
    };
  }

  /**
   * @static
   * @param  {String} privateKey        (optional) coin's private key
   * @param  {Object} network           (required) coin's network
   * @returns {String} wif
   */
  static getWif(privateKey, network) {
    try {
      wif.decode(privateKey);
      return privateKey;
    } catch (err) {
      return wif.encode(network.wif, Buffer.from(privateKey, 'hex'), true);
    }
  }
}

module.exports = Keychain;