const ecc = require('tiny-secp256k1')
const typeforce = require('typeforce')
const types = require('./types')
const wif = require('wif')
const Bitcoin = require('bitcoinjs-lib');

const NETWORKS = Bitcoin.networks;

// TODO: why is the function name toJSON weird?
function isPoint(x) {
  return ecc.isPoint(x)
}
const isOptions = typeforce.maybe(typeforce.compile({
  compressed: types.maybe(types.Boolean),
  network: types.maybe(types.Network)
}))

function ECPair(d, Q, options) {
  options = options || {}

  this.compressed = options.compressed === undefined ? true : options.compressed
  this.network = options.network || NETWORKS.bitcoin

  this.__d = d || null
  this.__Q = null
  if (Q) this.__Q = ecc.pointCompress(Q, this.compressed)
}

ECPair.prototype.toWIF = function () {
  if (!this.__d) throw new Error('Missing private key')
  return wif.encode(this.network.wif, this.__d, this.compressed)
}

module.exports = ECPair;