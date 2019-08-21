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

  if (typeof(platform) == 'string' && platform !== null && platform !== undefined) {
    platform = platform.toUpperCase();
  }

  if (hdPath === null || hdPath === undefined) {
    if ( isTestnet === true ) {
      hdPath = Bip44.getHDPath('TESTNET');
    } else {
      hdPath = Bip44.getHDPath(platform);
    }
  }

  // Generate sheet
  let seed = null;
  if (!password)
    seed = await Bip39.mnemonicToSeed(mnemonic, password);
  else 
    seed = await Bip39.mnemonicToSeed(mnemonic);

  let network = Networks.getNetwork(platform);
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
function getWif(value, version, compressed = true) {
  let isBuffer = Buffer.isBuffer(value);
  try {
    if (isBuffer) 
      wif.decodeRaw(value, version);
    else 
      wif.decode(value, version);
    return value;
  } catch (err) {
    let result = isBuffer ? 
      wif.encode(version, value, compressed) :
      wif.encode(version, Buffer.from(value), compressed);
    return result;
  }
}

function wifToPrivateKey() {
  
}

module.exports = {
  createKeypair,
  getWif
};