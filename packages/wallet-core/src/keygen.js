const Bip32 = require('bip32');
const Bip39 = require('bip39');
const wif = require('wif');
const Messages = require('./messages');
const AppError = require('./app_error');
const Bip44 = require('./bip44');
const Networks = require('./networks');

/**
 * Create keypair
 *
 * @param {*} platform
 * @param {*} mnemonic
 * @param {*} password
 * @param {*} hdPath
 * @param {*} isTestnet
 * @returns
 */
async function createKeypair(platform, mnemonic, password, hdPath, isTestnet) {
  if (platform === null || platform === undefined) {
    throw AppError.create(Messages.missing_parameter, 'platform');
  }

  if (mnemonic === null || mnemonic === undefined) {
    throw AppError.create(Messages.missing_parameter, 'mnemonic');
  }

  platform = platform.toUpperCase();
  if (hdPath === null || hdPath === undefined) {
    if (isTestnet === true) {
      hdPath = Bip44.getHDPath('TESTNET');
    } else {
      hdPath = Bip44.getHDPath(platform);
    }
  }

  // Generate seed
  let seed = null;
  if (password !== null && password !== undefined && password.length > 0)
    seed = await Bip39.mnemonicToSeed(mnemonic, password);
  else
    seed = await Bip39.mnemonicToSeed(mnemonic);

  let network = Networks.getNetwork(platform, isTestnet === true ? true : false);
  let masterKeyPair = Bip32.fromSeed(seed, network);
  let keypair = masterKeyPair.derivePath(hdPath);
  return keypair;
}

/**
 * Get wif from private key or wif
 *
 * @param {String|Buffer} value
 * @param {Number} version
 * @param {boolean} [compressed=true]
 * @returns
 */
function privateKeytoWif(privateKey, version, compressed = true) {
  if (privateKey === null || privateKey === undefined) {
    throw AppError.create(Messages.invalid_parameter, 'privateKey');
  }

  let isBuffer = Buffer.isBuffer(privateKey);
  try {
    if (isBuffer) {
      if (privateKey.length === 32) {
        return wif.encode(version, privateKey, compressed);
      } else {
        throw AppError.create(Messages.invalid_parameter, 'privateKey');
      }
    } else {
      // private key
      if (privateKey.length === 64) {
        return wif.encode(version, Buffer.from(privateKey, 'hex'), compressed);
      }
      else {
        wif.decode(privateKey, version);
        return privateKey;
      }
    }
  } catch (err) {
    throw err;
  }
}

/**
 * Get private key from wif
 * 
 * @param {*} wifKey 
 */
function wifToPrivateKey(wifKey) {
  let decode = wif.decode(wifKey);
  return decode.privateKey;
}

module.exports = {
  createKeypair,
  privateKeytoWif,
  wifToPrivateKey
};