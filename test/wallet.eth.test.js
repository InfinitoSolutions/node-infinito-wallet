const { Wallet, CoinType, InfinitoApi } = require('../index');
const ConfigTest = require('./config.test');
const Assert = require('assert');
const chai = require('chai');
chai.should();

let apiConfig = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL
};

let walletConfig = {
  coinType: CoinType.ETH.symbol,
  isTestNet: true,
  privateKey: '0x77d6f0d8768942c098e664bb4e930c5019755b90d6b0fb2fb43450d6270efb3d'
    // 0x6426b293207e124d334c8cb44380a4999ecc900e
};

var wallet = null;

describe('wallet.eth', async() => {
  beforeEach(async() => {
    let api = new InfinitoApi(apiConfig);
    wallet = new Wallet(walletConfig);
    wallet.setApi(api);
  });

  describe('#getBalance()', async() => {
    it('Get balance', async() => {
      let result = await wallet.getBalance();
      Assert.ok(result.balance !== undefined, 'balance must be exist');
    });
  });

  describe('#getHistory()', async() => {
    it('Get history', async() => {
      let result = await wallet.getHistory(0, 10);
      Assert.ok(result.transactions !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', () => {
    it('Get address', () => {
      let result = wallet.getAddress();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getNonce()', async() => {
    it('Get nonce', async() => {
      let result = await wallet.getNonce();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getTxCount()', async() => {
    it('Get TxCount', async() => {
      let result = await wallet.getTxCount();
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getTxAddress()', async() => {
    it('Get TxAddress', async() => {
      let result = await wallet.getTxAddress(0, 10);
      Assert.ok(
        result.transactions !== undefined,
        'transactions must be exist'
      );
    });
  });

  describe('#getInternalTxAddress()', async() => {
    it('Get InternalTxAddress', async() => {
      let result = await wallet.getInternalTxAddress(0, 10);
      Assert.ok(
        result.transactions !== undefined,
        'transactions must be exist'
      );
    });
  });

  describe('#getSmartContractInfo()', async() => {
    it('Get SmartContractInfo', async() => {
      let result = await wallet.getSmartContractInfo(
        '0x9d539c8534c156d76828992fd55a16f79afa9a36'
      );
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#getContractBalance()', async() => {
    it('Get ContractHistory', async() => {
      let result = await wallet.getContractBalance(
        '0x9d539c8534c156d76828992fd55a16f79afa9a36'
      );
      Assert.ok(result.balance !== undefined, 'balance must be exist');
    });
  });

  describe('#getContractHistory()', async() => {
    it('Get ContractHistory', async() => {
      let result = await wallet.getContractHistory(
        '0x9d539c8534c156d76828992fd55a16f79afa9a36',
        0,
        10
      );
      Assert.ok(result !== undefined, 'result must be exist');
    });
  });

  describe('#send()', async() => {
    it('Send', async() => {
      let result = await wallet.send({
        txParams: {
          to: '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c',
          amount: 12000000000,
          gasLimit: 300000,
          gasPrice: 40000000000
        },
        isBroadCast: true
      });
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });

  describe('#transfer()', async() => {
    it('transfer', async() => {
      // 0xad0c4aecee4761f82b8dd37431f57a41d95815ac
      // 0x9d539c8534c156d76828992fd55a16f79afa9a36
      let result = await wallet.transfer(
        '0x9d539c8534c156d76828992fd55a16f79afa9a36',
        '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c',
        10000, {
          gasLimit: 300000,
          gasPrice: 40000000000
        }
      );
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });


  describe('#deploy smartconstract()', async() => {
    it('Deploy', async() => {
      let smartcontractData = '0x608060405234801561001057600080fd5b50604051610a4d380380610a4d8339810160405280516020808301805190820180519083015160008054600160a060020a0333811661010084900a90810291021991821681179092556001805490911690911790559385018051909592909201939092909161008591600391908701906100ce565b5082516100999060049060208601906100ce565b5060ff9091166006556005819055600160a060020a033381161660009081526007602080830191825201902055506101699050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061010f57805160ff191683800117855561013c565b8280016001018555821561013c579182015b8281111561013c578251825591602001919060010190610121565b5061014892915061014c565b5090565b61016691905b808211156101485760008155600101610152565b90565b6108d5806101786000396000f3006080604052600436106100e55763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100ea578063095ea7b31461017457806313af4035146101b257806318160ddd146101d557806323b872dd146101fd5780632ccb1b301461022e578063313ce56714610255578063457f4d411461026a57806370a08231146102a757806383197ef0146102c85780638da5cb5b146102dd57806395d89b41146102f2578063a9059cbb1461022e578063d31fdffd14610307578063dd62ed3e14610328578063fbf1f78a14610352575b600080fd5b3480156100f657600080fd5b506100ff610373565b6040516020808201828103835283518152835183929182019185019080838360005b83811015610139578181015183820152602001610121565b50505050905090810190601f1680156101665780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561018057600080fd5b5061019b60048035600160a060020a031690602001356103ff565b604080519115151515825251602090910181900390f35b3480156101be57600080fd5b506101d3600160a060020a0360043516610478565b005b3480156101e157600080fd5b506101ea6104d5565b6040805191825251602090910181900390f35b34801561020957600080fd5b5061019b600160a060020a0360048035821691602091820180359091169101356104db565b34801561023a57600080fd5b5061019b60048035600160a060020a03169060200135610643565b34801561026157600080fd5b506101ea6106f5565b34801561027657600080fd5b5061027f6106fb565b6040518082600160a060020a0316600160a060020a0316815260200191505060405180910390f35b3480156102b357600080fd5b506101ea600160a060020a0360043516610712565b3480156102d457600080fd5b506101d3610734565b3480156102e957600080fd5b5061027f610775565b3480156102fe57600080fd5b506100ff61078d565b34801561031357600080fd5b506101d3600160a060020a03600435166107e6565b34801561033457600080fd5b506101ea60048035600160a060020a03908116916020013516610845565b34801561035e57600080fd5b506101d3600160a060020a0360043516610877565b600380546040805160206002600180861615610100020390941693909304601f810184900484028401820190925281815292918301828280156103f75780601f106103cc576101008083540402835291602001916103f7565b820191906000526020600020905b8154815290600101906020018083116103da57829003601f168201915b505050505081565b600160a060020a033381168082166000908152600860208083019182528181018084208887169687168552909252908220805486019055604080518681529051929493927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929190910181900390a35060015b92915050565b6000809054906101000a9004600160a060020a0316600160a060020a031633600160a060020a03161415156104ac57600080fd5b806000806101000a815481600160a060020a030219169083600160a060020a0316021790555050565b60055481565b600160a060020a0380841681166000818152600760208083019182528101808320549383526008825280832033861690951683529390529182205482911061056b576008600086600160a060020a0316600160a060020a03168152602001908152602001600020600033600160a060020a0316600160a060020a0316815260200190815260200160002054610592565b6007600086600160a060020a0316600160a060020a03168152602001908152602001600020545b9050828110151561063657600160a060020a0380861680821660008181526008602080830191825281810180842033881688168552835280842080548b90039055938352600780835284842080548b900390558a871696871684529091529190208054870190556040805187815290517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929190910181900390a36001915061063b565b600091505b509392505050565b6000816007600033600160a060020a0316600160a060020a03168152602001908152602001600020541015156106ec57600160a060020a0333811680821660009081526007602080830182815280820180852080548a90039055898716968716855292905291208054860190556040805186815290517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929190910181900390a3506001610472565b50600092915050565b60065481565b60015460006101000a9004600160a060020a031681565b600160a060020a03908116166000908152600760208083019182520190205490565b600160009054906101000a9004600160a060020a0316600160a060020a031633600160a060020a031614151561076957600080fd5b33600160a060020a0316ff5b6000809054906101000a9004600160a060020a031681565b600480546040805160206002600180861615610100020390941693909304601f810184900484028401820190925281815292918301828280156103f75780601f106103cc576101008083540402835291602001916103f7565b600160009054906101000a9004600160a060020a0316600160a060020a031633600160a060020a031614151561081b57600080fd5b80600160006101000a815481600160a060020a030219169083600160a060020a0316021790555050565b600160a060020a0391821682166000908152600860208083019182528101808320938516909416825291909152205490565b600160a060020a03338116811660009081526008602080830191825281018083209484169093168252929092528120555600a165627a7a723058205f3a5f9d434deb95af0296bc1aa16e73019f99bb59379df6a54fd62057e494090029000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000174876e800000000000000000000000000000000000000000000000000000000000000000444454d4f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000444454d4f00000000000000000000000000000000000000000000000000000000';
      let result = await wallet.send({
        txParams: {
          gasLimit: 3000000,
          gasPrice: 40000000000,
          data: smartcontractData
        },
        isBroadCast: true
      });
      console.log(result);
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });
});