const conseiljs = require('conseiljs');

class TezosCommon {
    constructor() {

    }

    generateMnemonic() {
        try {
            let mnemonic = conseiljs.TezosWalletUtil.generateMnemonic(128);
            return mnemonic;
        } catch (err) {
            return err;
        }
    }
}

module.exports = TezosCommon;
