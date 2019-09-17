const Assert = require('assert');
const chai = require('chai');
const Keygen = require('../src/keygen');

chai.should();
const expect = chai.expect;

describe.only('keygen', async() => {

  describe.only('createKeypair - sample data', async() => {

    let listCase = require('./keygen_data');
    let index = 0;
    listCase.forEach( curCase => {
      index++;
      it(`case ${index}: ${curCase.name}`, async() => {
        let caseDesc = JSON.stringify(curCase);
        console.log('curCase :', curCase);
        if( curCase.expected.exception !== undefined ) {
          try {
            await Keygen.createKeypair(curCase.config.platform, curCase.config.mnemonic, curCase.config.password, curCase.config.hdPath, curCase.config.testnet);
            Assert.fail('Should be error', caseDesc);
          } catch(err) {
            Assert.equal(err.message, curCase.expected.exception, caseDesc);
          }
        } else {
          let result = await Keygen.createKeypair(curCase.config.platform, curCase.config.mnemonic, curCase.config.password, curCase.config.hdPath, curCase.config.testnet);
          Assert.equal(result.privateKey.toString("hex"), curCase.expected.privateKey, caseDesc);
          Assert.equal(result.publicKey.toString("hex"), curCase.expected.publicKey, caseDesc);
          Assert.equal(JSON.stringify(result.network), JSON.stringify(curCase.expected.network), caseDesc);
        }
      })
    });

  })
});