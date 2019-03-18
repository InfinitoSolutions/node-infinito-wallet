require('dotenv').config();

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'NONE', // ALL, DEBUG, INFO, WARN, ERROR, NONE
  API_KEY: process.env.API_KEY,
  SECRECT: process.env.SECRET_KEY,
  BASE_URL: process.env.BASE_URL,
  // Mainnet
  API_KEY_MAINNET: process.env.API_KEY_MAINNET,
  SECRECT_MAINNET: process.env.SECRET_KEY_MAINNET,
  BASE_URL_MAINNET: process.env.BASE_URL_MAINNET,
  // Testnet
  API_KEY_TESTNET: process.env.API_KEY_TESTNET,
  SECRECT_TESTNET: process.env.SECRET_KEY_TESTNET,
  BASE_URL_TESTNET: process.env.BASE_URL_TESTNET,
  // KEY
  MNEMONIC: process.env.MNEMONIC,
  PRIVATE_KEY_BTC: process.env.PRIVATE_KEY_BTC
};