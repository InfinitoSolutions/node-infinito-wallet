const WalletEth = require('../lib/wallet_eth');
const ConfigTest = require('./config.test.mainnet');
const CoinType = require('../lib/support_coin');
const InfinitApi = require('node-infinito-api');

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
  coinType: CoinType.ETH.symbol,
  isTestNet: false,
  privateKey: '0x77d6f0d8768942c098e664bb4e930c5019755b90d6b0fb2fb43450d6270efb3d'
  //'0x6426b293207e124d334c8cb44380a4999ecc900e'
};

async function test() {
  let api = new InfinitApi(opts);
  let wallet = new WalletEth(opts);
  wallet.setApi(api);


  // let result = await wallet.getAddress();
  // console.log('result getAddress ETH: ' + JSON.stringify(result));

  let result = await wallet.getBalance();
  console.log('result getBalance ETH: ' + JSON.stringify(result));

  let resultSend = await wallet.send({
    txParams: {
      to: '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c',
      value: 12,
      nonce: 1,
      gasLimit: 300000,
      gasPrice: 20000000000,
      nameFunc: 'commit', //Smart contract
      typeParams: ['uint256', 'bytes32'], //Smart contract
      paramsFuncs: [1, 2], //Smart contract
    },
    isBroadCast: true
  });
  console.log('result send ETH: ' + JSON.stringify(resultSend));
}

test();