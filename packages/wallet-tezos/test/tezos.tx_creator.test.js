const TezosTxCreator = require('../src/tezos.tx_creator');
const conseiljs = require('conseiljs');

let txCreator = new TezosTxCreator();

async function test() {
    let tezosNode = "http://mainnet-node.tzscan.io:8732";
    let address = "tz1QFab6SbVNy7da4539SRKdvVeL6rhMsn62";
    let activationCode = "64bbfe0557e99be17c1d71e997b14f83590a00ff";
    let privateKey = "edskS77DZv2Z2Wp4MmFygit2E3ETFVemgZkAVwrBZkyQfvckGYH3Q6Wn7pirHmxuFM6xWRzx8rzL7CskVm6YTJRUr9QThA9e6t";
    let storeType = conseiljs.StoreType.Fundraiser;
    let rawTransaction = await txCreator.createRawTxToActivateAddress(tezosNode, address, activationCode, privateKey, storeType);
    console.log("rawTransaction: ", rawTransaction);
}

async function test2() {
    let tezosNode = "http://mainnet-node.tzscan.io:8732";
    let address = "tz1QFab6SbVNy7da4539SRKdvVeL6rhMsn62";
    let publicKey = "edpktwLfa1R7DxXSUyVHJH8mUKh7UFGzyoMZaujELnHgh3zbXonSyr";
    let privateKey = "edskS77DZv2Z2Wp4MmFygit2E3ETFVemgZkAVwrBZkyQfvckGYH3Q6Wn7pirHmxuFM6xWRzx8rzL7CskVm6YTJRUr9QThA9e6t";
    let storeType = conseiljs.StoreType.Fundraiser;
    let rawTransaction = await txCreator.createRawTxToRevealAddress(tezosNode, address, publicKey, privateKey, storeType);
    console.log("rawTransaction: ", rawTransaction);
}

async function test3() {
    let tezosNode = "http://mainnet-node.tzscan.io:8732";
    let address = "tz1QFab6SbVNy7da4539SRKdvVeL6rhMsn62";
    let publicKey = "edpktwLfa1R7DxXSUyVHJH8mUKh7UFGzyoMZaujELnHgh3zbXonSyr";
    let privateKey = "edskS77DZv2Z2Wp4MmFygit2E3ETFVemgZkAVwrBZkyQfvckGYH3Q6Wn7pirHmxuFM6xWRzx8rzL7CskVm6YTJRUr9QThA9e6t";
    let storeType = conseiljs.StoreType.Mnemonic;
    let toAddress = "tz1PehUKVWPL8cHU1XJtfM8jthv2NUR6mFFM";
    let value = 50000;
    let fee = 1500;
    let rawTransaction = await txCreator.createRawTxToSendValue(tezosNode, address, publicKey, privateKey, storeType, toAddress, value, fee);
    console.log("rawTransaction: ", rawTransaction);
}

test3();
