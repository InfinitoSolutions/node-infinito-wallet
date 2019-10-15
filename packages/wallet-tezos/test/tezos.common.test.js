const TezosCommon = require('../src/tezos.common');

let common = new TezosCommon();

let mnemonic = common.generateMnemonic();
console.log("mnemonic: ", mnemonic);
