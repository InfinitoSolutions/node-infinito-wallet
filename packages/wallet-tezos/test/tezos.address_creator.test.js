const TezosAddressCreator = require('../src/tezos.address_creator');

let addressCreator = new TezosAddressCreator();

async function test() {
    let mnemonic = "pilot cradle unhappy gown tongue degree obvious example polar plug tomato breeze";
    let keystore = await addressCreator.createAddressFromMnemonic(mnemonic);
    console.log("keystore: ", keystore);
}

async function test2() {
    let mnemonic = "crumble mirror column two wheel assault process clip never betray act bike marine exact wool";
    let fundraiserEmail = "gduqqryg.fqcxutlc@tezos.example.org";
    let fundraiserPassword = "IeiZfWbQ2T";
    let address = "tz1QFab6SbVNy7da4539SRKdvVeL6rhMsn62";
    let keystore = await addressCreator.unlockFundraiserAddress(mnemonic, fundraiserEmail, fundraiserPassword, address);
    console.log("keystore: ", keystore);
}

test2();
