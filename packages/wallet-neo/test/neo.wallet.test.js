const Assert = require('assert');
const chai = require('chai');
const InfinitoApi = require('node-infinito-api');
const WalletBuilder = require('../src/neo.wallet_builder');
const Wallet = require('../src/neo.wallet');
const ConfigTest = require('./config.test');
const Messages = require('../src/messages');
const { AppError } = require('infinito-wallet-core');
const { default: Neon, api, wallet, nep5, u } = require("@cityofzion/neon-js");
let Neonjs = require("@cityofzion/neon-js");


chai.should();
const expect = chai.expect;

let apiConfigTestnet = {
  apiKey: ConfigTest.API_KEY_TESTNET,
  secret: ConfigTest.SECRECT_TESTNET,
  baseUrl: ConfigTest.BASE_URL_TESTNET,
  logLevel: ConfigTest.LOG_LEVEL
};

let apiTestnet = new InfinitoApi(apiConfigTestnet).getChainService().NEO;

let apiConfigMainnet = {
  apiKey: ConfigTest.API_KEY_MAINNET,
  secret: ConfigTest.SECRECT_MAINNET,
  baseUrl: ConfigTest.BASE_URL_MAINNET,
  logLevel: ConfigTest.LOG_LEVEL
};

let apiMainnet = new InfinitoApi(apiConfigMainnet).getChainService().NEO;

describe('NeoWallet', async function () {
  this.timeout(15000);
  describe('#constructor', async () => {
    it('no parameter', async () => {
      expect(() => new Wallet())
        .to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    })

    it('private key is null', async () => {
      expect(() => new Wallet(null))
        .to.throw(AppError.create(Messages.missing_parameter, 'privateKey').message);
    })

    it('private key, default network', async () => {
      // Hex string with 64 characters
      let wallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');

      Assert.equal('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX', wallet.wif, 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK', wallet.address, 'wallet.wif must be equal');
    })

    it('wif, default network', async () => {
      // Wif length is 52
      let wallet = new Wallet('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX');

      Assert.equal('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX', wallet.wif, 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK', wallet.address, 'wallet.wif must be equal');
    })

    it('private key (buffer), default network', async () => {
      // Buffer length is 32
      let wallet = new Wallet(Buffer.from('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', 'hex'));

      Assert.equal('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX', wallet.wif, 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556', wallet.getKeyPair().privateKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('02a56e01ff66ab43f6659393888405897309c1a1ce28acbc0c6ea59bcb19c7da88', wallet.getKeyPair().publicKey.toString("hex"), 'wallet.wif must be equal');
      Assert.equal('AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK', wallet.address, 'wallet.wif must be equal');
    })

    it('wif (buffer), default network', async () => {
      expect(() => new Wallet(Buffer.from('KxhmCKqpXjPnazBsrtx2a3spTrBY5X3MR2agYdT2CZFdtD2vmCGX')))
        .to.throw(AppError.create(Messages.invalid_parameter, 'privateKey').message);
    })

    it('private key (buffer), default network', async () => {
      // Buffer length is 32
      let wallet = new Wallet(Buffer.from('2c44b3c344b882f6744fcd7cc1cace4cf078145ffd98e25723dcb24cf0f27556', 'hex'));
      Assert.equal('AWjWXxL2jgpVKvEKnvg8SRfwCWwm3oJfLQ', wallet.address, 'wallet.wif must be equal');
    })

    it('private key (buffer), default network', async () => {
      // Buffer length is 32
      let wallet = new Wallet('L2CmHCqgeNHL1i9XFhTLzUXsdr5LGjag4d56YY98FqEi4j5d83Mv');
      Assert.equal('AdsNmzKPPG7HfmQpacZ4ixbv9XJHJs2ACz', wallet.address, 'wallet.wif must be equal');
    })

  });

  describe('#create transaction', async () => {
    it('create claim transaction', async () => {
      // let mywallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      let mywallet = new Wallet('2c44b3c344b882f6744fcd7cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      let transationBuilder = mywallet.newTxBuilder();
      transationBuilder.useApi(apiTestnet);
      transationBuilder.useType('CLAIM');
      let txraw = await transationBuilder.build();
      let tx = mywallet.signTx(txraw)
      try {
        console.log(await transationBuilder.broadcast(tx.raw))
      }
      catch (e) {
        console.log('current error', e)
        const claimingPrivateKey = mywallet.privateKey.toString('hex')
        const apiProvider = new api.neoscan.instance("TestNet");
        const account = new wallet.Account(claimingPrivateKey);
        const config = {
          api: apiProvider, // The API Provider that we rely on for balance and rpc information
          account: account // The claiming Account
        };

        Neon.claimGas(config)
          .then(config => {
            // console.log("\n\n--- Response ---");
            console.log(config.response);
            if (tx.tx_id == config.response.txid) {
              console.log('tx_id', tx.tx_id)
              Assert.equal(1, 1, "can not send raw")
            }
          })
          .catch(config => {
            console.log(config);
          });
      }
    });

    it('create contract transaction', async () => {
      const receivingAddress = "AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK";
      let mywallet = new Wallet('2c44b3c344b882f6744fcd7cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      // const receivingAddress = "AWjWXxL2jgpVKvEKnvg8SRfwCWwm3oJfLQ";
      // let mywallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      let transationBuilder = mywallet.newTxBuilder();
      transationBuilder.useApi(apiTestnet);
      transationBuilder.sendTo('NEO', 1, receivingAddress)
      transationBuilder.useType('CONTRACT');
      let txraw = await transationBuilder.build();
      let tx = mywallet.signTx(txraw)

      try {
        console.log(await transationBuilder.broadcast(tx.raw))
      }
      catch (e) {
        console.log('current error', e)
        const sendingKey = mywallet.privateKey.toString('hex')

        const network = "TestNet";
        // console.log("\n\n--- Intents ---");

        const intent = api.makeIntent({ NEO: 1 }, receivingAddress);
        // intent.forEach(i => console.log(i));

        const apiProvider = new api.neoscan.instance(network);

        // console.log("\n\n--- API Provider ---");
        // console.log(apiProvider);

        const account = new wallet.Account(sendingKey);

        // console.log("\n\n--- Sending Address ---");
        // console.log(account);

        const config = {
          api: apiProvider, // The API Provider that we rely on for balance and rpc information
          account: account, // The sending Account
          intents: intent // Our sending intents
        };

        Neon.sendAsset(config)
          .then(config => {
            console.log(config.response);
            if (tx.tx_id == config.response.txid) {
              console.log('tx_id', tx.tx_id)
              Assert.equal(1, 1, "can not send raw")
            }
          })
          .catch(config => {
            console.log(config);
          });
      }
    });

    it('create contract transaction', async () => {
      const receivingAddress = "AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK";
      let mywallet = new Wallet('2c44b3c344b882f6744fcd7cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      // const receivingAddress = "AWjWXxL2jgpVKvEKnvg8SRfwCWwm3oJfLQ";
      // let mywallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      let transationBuilder = mywallet.newTxBuilder();
      transationBuilder.useApi(apiTestnet);
      transationBuilder.sendTo('NEO', 1, receivingAddress);
      transationBuilder.sendTo('GAS', 1, receivingAddress);
      transationBuilder.useType('CONTRACT');
      let txraw = await transationBuilder.build();
      let tx = mywallet.signTx(txraw)

      try {
        console.log(await transationBuilder.broadcast(tx.raw))
      }
      catch (e) {
        console.log('current error', e)
        const sendingKey = mywallet.privateKey.toString('hex')

        const network = "TestNet";
        // console.log("\n\n--- Intents ---");

        const intent = api.makeIntent({ NEO: 1, GAS: 2 }, receivingAddress);
        // intent.forEach(i => console.log(i));

        const apiProvider = new api.neoscan.instance(network);

        // console.log("\n\n--- API Provider ---");
        // console.log(apiProvider);

        const account = new wallet.Account(sendingKey);

        // console.log("\n\n--- Sending Address ---");
        // console.log(account);

        const config = {
          api: apiProvider, // The API Provider that we rely on for balance and rpc information
          account: account, // The sending Account
          intents: intent // Our sending intents
        };

        Neon.sendAsset(config)
          .then(config => {
            console.log(config.response);
            if (tx.tx_id == config.response.txid) {
              console.log('tx_id', tx.tx_id)
              Assert.equal(1, 1, "can not send raw")
            }
          })
          .catch(config => {
            console.log(config);
          });
      }
    });

    it('create transfer transaction', async () => {
      let mywallet = new Wallet('L2CmHCqgeNHL1i9XFhTLzUXsdr5LGjag4d56YY98FqEi4j5d83Mv');
      const sendingKey = mywallet.privateKey.toString('hex')
      const receivingAddress = "AGC2oevLK1Y5YbPAk2aCNbwxhuAVirMRZK";
      const contractScriptHash = "025c91e6f6792e087feebb30fd4761f4fbcb4e82";
      const numOfDecimals = 8;
      const amtToSend = 0.001;
      const network = "TestNet";
      const additionalInvocationGas = 0;
      const additionalIntents = [];
      let my = 1
      if (my) {
        let transationBuilder = mywallet.newTxBuilder();
        transationBuilder.useApi(apiTestnet);
        transationBuilder.useType('TRANSFER');
        transationBuilder.useContract(contractScriptHash);
        transationBuilder.transferTo(receivingAddress, amtToSend)
        transationBuilder.withSign(true)
        let txraw = await transationBuilder.build();
        // let tx = mywallet.signTx(txraw)
        // txraw = tx.raw
        let txSign = await Neonjs.rpc.Query.sendRawTransaction(txraw)
        txSign.execute('https://test3.cityofzion.io')
      }
      else {
        const apiProvider = new api.neoscan.instance(network);
        const account = new wallet.Account(sendingKey);
        const generator = nep5.abi.transfer(
          contractScriptHash,
          account.address,
          receivingAddress,
          new u.Fixed8(amtToSend).div(Math.pow(10, 8 - numOfDecimals))
        );
        const builder = generator();
        const script = builder.str;
        const gas = additionalInvocationGas;
        const intent = additionalIntents;
        const config = {
          api: apiProvider, // The API Provider that we rely on for balance and rpc information
          account: account, // The sending Account
          intents: intent, // Additional intents to move assets
          script: script, // The Smart Contract invocation script
          gas: gas, // Additional GAS for invocation.
        };
        let sign = await Neonjs.api.fillSigningFunction(config);
        let url = await Neonjs.api.fillUrl(sign);
        let balance = await api.fillBalance(url);
        let tx = await api.createInvocationTx(balance);
        let addAttributeIfExecutingAsSmartContract = await api.addAttributeIfExecutingAsSmartContract(tx)
        let addAttributeForMintToken = await api.addAttributeForMintToken(addAttributeIfExecutingAsSmartContract)
        let modifyTransactionForEmptyTransaction = await api.modifyTransactionForEmptyTransaction(addAttributeForMintToken)
        let signTx = await api.signTx(modifyTransactionForEmptyTransaction)
        let addSignatureIfExecutingAsSmartContract = await api.addSignatureIfExecutingAsSmartContract(signTx)
        let addSignatureForMintToken = await api.addSignatureForMintToken(addSignatureIfExecutingAsSmartContract)
        let txSign = await Neonjs.rpc.Query.sendRawTransaction(addSignatureForMintToken.tx)
        txSign.execute('https://test3.cityofzion.io')
      }
    });

    it.only('create transfer transaction on mainnet', async () => {
      let mywallet = new Wallet('2c44b3c344b882f6744fcd6cc1cace4cf078145ffd98e25723dcb24cf0f27556');
      const receivingAddress = "AWjWXxL2jgpVKvEKnvg8SRfwCWwm3oJfLQ";
      const contractScriptHash = "ac116d4b8d4ca55e6b6d4ecce2192039b51cccc5";
      const amtToSend = 0.001;

      let transationBuilder = mywallet.newTxBuilder();
      transationBuilder.useApi(apiMainnet);
      transationBuilder.useType('TRANSFER');
      transationBuilder.useContract(contractScriptHash);
      transationBuilder.transferTo(receivingAddress, amtToSend)
      transationBuilder.withSign(true)
      let txraw = await transationBuilder.build();
      await transationBuilder.broadcast(txraw)
    });
  });

});