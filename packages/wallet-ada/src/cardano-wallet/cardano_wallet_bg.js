
const path = require('path').join(__dirname, 'cardano_wallet_bg.wasm');
const fs = require('fs');
// console.log(path, fs);

// const fetch = require('whatwg-fetch');
// const BinaryFile = fetch('./cardano_wallet_bg.wasm', {}).then(console.log);
// console.log(BinaryFile);

const bytes = fs.readFileSync(path);
let imports = {};
imports['./cardano_wallet'] = require('./cardano_wallet');

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
module.exports = wasmInstance.exports;
