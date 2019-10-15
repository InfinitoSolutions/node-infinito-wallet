const conseiljs = require('conseiljs');
const constants = require('conseiljs/dist/types/tezos/TezosConstants.js');

class TezosTxCreator {
    constructor() {

    }

    async createRawTxToActivateAddress(tezosNode, address, activationCode, privateKey, storeType, derivationPath = '') {
        try {
            let objPrivateKey = {
                privateKey: privateKey,
                storeType: storeType
            };

            let activation = {
                kind:   'activate_account',
                pkh:    address,
                secret: activationCode
            };

            let blockHead = await conseiljs.TezosNodeReader.getBlockHead(tezosNode);
            let forgedOperationGroup = await conseiljs.TezosNodeWriter.forgeOperations(blockHead.hash, [activation]);
            let signedOpGroup = await conseiljs.TezosNodeWriter.signOperationGroup(forgedOperationGroup, objPrivateKey, derivationPath);
            let rawTransaction = signedOpGroup.bytes.toString('hex');

            return rawTransaction;
        } catch (err) {
            return err;
        }
    }

    async createRawTxToRevealAddress(tezosNode, address, publicKey, privateKey, storeType, derivationPath = '') {
        try {
            let objPrivateKey = {
                privateKey: privateKey,
                storeType: storeType
            };

            let counter = await conseiljs.TezosNodeReader.getCounterForAccount(tezosNode, address) + 1;

            let revealOp = {
                kind: 'reveal',
                source: address,
                fee: constants.TezosConstants.DefaultKeyRevealFee + '',
                counter: counter.toString(),
                gas_limit: '10000',
                storage_limit: '0',
                public_key: publicKey
            };

            let blockHead = await conseiljs.TezosNodeReader.getBlockHead(tezosNode);
            let forgedOperationGroup = await conseiljs.TezosNodeWriter.forgeOperations(blockHead.hash, [revealOp]);
            let signedOpGroup = await conseiljs.TezosNodeWriter.signOperationGroup(forgedOperationGroup, objPrivateKey, derivationPath);
            let rawTransaction = signedOpGroup.bytes.toString('hex');

            return rawTransaction;
        } catch (err) {
            return err;
        }
    }

    async createRawTxToSendValue(tezosNode, address, publicKey, privateKey, storeType, toAddress, value, fee, derivationPath = '') {
        try {
            let objPublicKey = {
                publicKey: publicKey
            };

            let objPrivateKey = {
                privateKey: privateKey,
                storeType: storeType
            };

            let counter = await conseiljs.TezosNodeReader.getCounterForAccount(tezosNode, address) + 1;

            let transaction = {
                source: address,
                destination: toAddress,
                amount: value.toString(),
                fee: fee.toString(),
                storage_limit: constants.TezosConstants.DefaultTransactionStorageLimit + '',
                gas_limit: constants.TezosConstants.DefaultTransactionGasLimit + '',
                counter: counter.toString(),
                kind: 'transaction'
            };

            let operations = await conseiljs.TezosNodeWriter.appendRevealOperation(tezosNode, objPublicKey, address, counter - 1, [transaction]);
            let blockHead = await conseiljs.TezosNodeReader.getBlockHead(tezosNode);
            let forgedOperationGroup = await conseiljs.TezosNodeWriter.forgeOperations(blockHead.hash, operations);
            let signedOpGroup = await conseiljs.TezosNodeWriter.signOperationGroup(forgedOperationGroup, objPrivateKey, derivationPath);
            let rawTransaction = signedOpGroup.bytes.toString('hex');

            return rawTransaction;
        } catch (err) {
            return err;
        }
    }
}

module.exports = TezosTxCreator;
