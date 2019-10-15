const conseiljs = require('conseiljs');

class TezosAddressCreator {
    constructor() {

    }

    async createAddressFromMnemonic(mnemonic, password = '') {
        try {
            let keystore = await conseiljs.TezosWalletUtil.unlockIdentityWithMnemonic(mnemonic, password);
            return keystore;
        } catch (err) {
            return err;
        }
    }

    async unlockFundraiserAddress(mnemonic, fundraiserEmail, fundraiserPassword, address) {
        try {
            let keystore = await conseiljs.TezosWalletUtil.unlockFundraiserIdentity(mnemonic, fundraiserEmail, fundraiserPassword, address);
            return keystore;
        } catch (err) {
            return err;
        }
    }
}

module.exports = TezosAddressCreator;
