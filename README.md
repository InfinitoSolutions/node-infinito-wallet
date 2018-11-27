# node-infinito-wallet
node-infinito-wallet

## Infinito SDK Wallet
author: IBL
license: MIT

In order to using Infinito SDK API you have to provide API Key and SecretKey. Those keys are provide by IBL

For develop environment please using:
> Endpoint: https://staging-api-testnet.infinitowallet.io
> ApiKey: 68b2fa19-c920-4315-96d3-8d883f330d86
> Secret: etzz6w9UdsjWBA4NJtV46W6sckwhuGQruSqHWVarggHU7vU7Ldv509qLuGdUKHe3.

---
## List Cryptocurrency Support
*  **BTC (Bitcoin)**: [Account](#Account0), [getApi](#getApi), [getAddress](#getAddress), [getBalance](#getBalance0), [getHistory](#get-History-transaction), [createRawTx](#Create-raw-transaction), [send](#send-transaction0)
*  **DOGE (Dogecoin)**: [Account](#Account0), [getApi](#getApi), [getAddress](#getAddress), [getBalance](#getBalance0), [getHistory](#get-History-transaction), [createRawTx](#Create-raw-transaction), [send](#send-transaction0)
*  **DASH (Dashcoin)**: [Account](#Account0), [getApi](#getApi), [getAddress](#getAddress), [getBalance](#getBalance0), [getHistory](#get-History-transaction), [createRawTx](#Create-raw-transaction), [send](#send-transaction0)
*  **LTC (Litecoin)**: [Account](#Account0), [getApi](#getApi), [getAddress](#getAddress), [getBalance](#getBalance0), [getHistory](#get-History-transaction), [createRawTx](#Create-raw-transaction), [send](#send-transaction0)
*  **BCH (Bitcoin cash)**: [Account](#BCH), [getApi](#getApi), [getAddress](#getAddress), [getBalance](#getBalance0), [getHistory](#get-History-transaction), [createRawTx](#Create-raw-transaction), [send](#send-transaction0)
*  **ETH (Ethereum)**: [Account](#Account0), [getApi](#getApi), [getAddress](#getAddress), [getBalance](#getBalance0), [getHistory](#get-History-transaction), [createRawTx](#Create-raw-transaction), [send](#send-transaction0), [transfer](#tranfer), [getContract](#Get-Smart-Contract-List),[getSmartContractInfo](#Get-Smart-Contract-Info), [getContractHistory](#Get-Smart-Contract-History),[getContractBalance](#Get-Smart-Contract-Balance)
*  **ETC (Ethereum classic)**: [Account](#Account0), [getApi](#getApi), [getAddress](#getAddress), [getBalance](#getBalance0), [getHistory](#get-History-transaction), [createRawTx](#Create-raw-transaction), [send](#send-transaction0), [transfer](#tranfer), [getContract](#Get-Smart-Contract-List),[getSmartContractInfo](#Get-Smart-Contract-Info), [getContractHistory](#Get-Smart-Contract-History),[getContractBalance](#Get-Smart-Contract-Balance)
*  **NEO**: [Account](#Create-instanse-of-Wallet3), [getApi](#getApi), [getAddress](#getAddress), [getBalance](#GetBalance), [getClaimable](#getClaimable),[getUnclaimed](#getUnclaimed),[getContractInfo](#getContractInfo), CallFunction Smartcontract
## Example

### BTC, DOGE, DASH, LTC.
#### Create instanse of Wallet
```javascript
const { Wallet, CoinType, EthWallet,BchWallet, InfinitoApi, NeoWallet } = require('node-infinito-wallet');
let apiConfig = {
  apiKey: 'test',
  secret: '123456',
  baseUrl: 'https://staging-api-testnet.infinitowallet.io',
  logLevel: 'NONE'
}

///if you have privateKey then supply private key to create wallet or you can pass passphrase to create wallet 
let walletConfig = {
  coinType: CoinType.BTC.symbol,  //change for case LTC, DOGE, DASH
  isTestNet: true,
  privateKey:   'cVg2gYrsfHBf4iBWncrm86VHd1VqcUCFdJ9FJtLbdLfwvqc1eL6v'
}

// Create wallet instanse.
// Note: need to set InfinitoApi
let api = new InfinitoApi(apiConfig);
let wallet = new Wallet(walletConfig);
wallet.setApi(api);
 ```
 #### Account
 get info Account. You can get provateKey, PublicKey.. from Account object
 ```javascript
let account = wallet.Account;
 ```
 Response
 ```
 {
    address:'',
    privateKey: '',
    publicKey:'',
    network:Object,
    isTestNet: false,
    keyPair: Object
 }
 ```
 
 #### getApi
 ``` javascript
 let result = wallet.getApi();
 ```
 
 #### getAddress
 ``` javascript
 let result = wallet.getAddress();
 ```
 Response
 ```
'1Dp1TZfsMDfrNwuAzXi8mJwcXNA5xiHPor'
 ```
 
 
 #### getBalance
 ``` javascript
 let result = wallet.getBalance();
 ```
 
 Response: Based on cointype
 ```
 {
   "balance": 0 
 }
 ```
 
  #### get History transaction
 ``` javascript
   let result = await wallet.getHistory(0, 10);
 ```
 
 Response: Based on cointype
 ```
 {
   "total": 2,
   "from": 0,
   "to": 1,
   "txs": [
     [
       {
         "tx_id": "97e68b71f0e00a046a839f0fb418cf0b2e8ce1927b082351f0a8c027995aef4c",
         "time": 1526625529,
         "confirmations": 1,
         "value": 6184973,
         "fee": 23052,
         "type": 1
       } 
     ]
   ]
 }
 ```

#### Create raw transaction
 ``` javascript
 let result = await wallet.createRawTx({
        txParams: {
          to: 'mssJexznaEypEfeLGf4v7J2WvKX6vFAjrs',
          amount: 1000,
          fee: 50
        }
      });
 ```
Response
```
{
   raw: '',
   tx_id: '',
   fee:200
}
```

 #### send transaction
 ``` javascript
 /// Send transaction with rawTx
 let result = await wallet.send({
          rawTx:''
      });
 
 /// Send transaction with params
 let result = await wallet.send({
        txParams: {
          to: 'mssJexznaEypEfeLGf4v7J2WvKX6vFAjrs',
          amount: 1000,
          fee: 50
        }
      });
 ```

Response
```
{
   raw: '',
   tx_id: '', 
}
```
 
### BCH.
#### Create instanse of Wallet
```javascript
const { Wallet, CoinType, InfinitoApi } = require('node-infinito-wallet');
let apiConfig = {
  apiKey: 'test',
  secret: '123456',
  baseUrl: 'https://staging-api-testnet.infinitowallet.io',
  logLevel: 'NONE'
}

///if you have privateKey then supply private key to create wallet or you can pass passphrase to create wallet 
let walletConfig = {
  coinType: CoinType.BCH.symbol,  
  isTestNet: true,
  privateKey:   'cVg2gYrsfHBf4iBWncrm86VHd1VqcUCFdJ9FJtLbdLfwvqc1eL6v'
}
 
// Note: need to set InfinitoApi
let api = new InfinitoApi(apiConfig);
let wallet = new Wallet(walletConfig);
wallet.setApi(api);
 ```
 
### ETC, ETH.
#### Create instanse of Wallet
```javascript
const { Wallet, CoinType, InfinitoApi } = require('node-infinito-wallet');
let apiConfig = {
  apiKey: 'test',
  secret: '123456',
  baseUrl: 'https://staging-api-testnet.infinitowallet.io',
  logLevel: 'NONE'
}

///if you have privateKey then supply private key to create wallet or you can pass passphrase to create wallet 
let walletConfig = {
  coinType: CoinType.ETC.symbol,  // change for case ETH
  isTestNet: true,
  privateKey:   'cVg2gYrsfHBf4iBWncrm86VHd1VqcUCFdJ9FJtLbdLfwvqc1eL6v'
}
 
// Note: need to set InfinitoApi
let api = new InfinitoApi(apiConfig);
let wallet = new Wallet(walletConfig);
wallet.setApi(api);
 ```
 
 Beside functions like Bitcoin, Ethereum support some functions below
 
 
#### Create raw transaction
 ``` javascript
 let result = await wallet.createRawTx({
        txParams: {
          to: '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c',
          amount: 12000000000,
          gasLimit: 300000,
          gasPrice: 40000000000
        }
      });
 ```
Response
```
'0xf8aa3d85023c346000830493e094464e3e8c11082dc80507e11886e58afe65af4c4e80b8442ccb1b30000000000000000000000000e0bcec523eb3661cfd8a349330f04955c9a2ed6c00000000000000000000000000000000000000000000000000000000000000001ca0adb4905fa408b44d11f612476e6277861b4bfcd9a38107b584c50ae99961637ba0198307803ccaad52e6585136f1e1d4669baa33a5fd4536ed90b9fd8d5388ecc1'
```
  #### send transaction
 ``` javascript
 /// Send transaction with rawTx
 let result = await wallet.send({
          rawTx:''
      });
 
 /// Send transaction with params
 let result = await wallet.send({
        txParams: {
          to: '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c',
          amount: 12000000000,
          gasLimit: 300000,
          gasPrice: 40000000000
        }
      });
 ```

Response
```
{
   raw: '',
   tx_id: '', 
}
```
 #### tranfer
 when you need to call method transfer on smartcontract
 ``` javascript
    let result = await wallet.transfer('0x9d539c8534c156d76828992fd55a16f79afa9a36', '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c', 10000);
 ```
Response
```
{
   raw: '',
   tx_id: '', 
}
```
 
 
  #### Get Smart Contract List
 ``` javascript
 let result = wallet.getContract();
 ```
 
 Response
``` 
```
 
  
#### Get Smart Contract Info
 ``` javascript
 let scAddress = '0x9d539c8534c156d76828992fd55a16f79afa9a36';
 let result = wallet.getSmartContractInfo(scAddress);
 ```
 Response
``` 
{
   "address": "0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0",
   "name": "EOS",
   "symbol": "EOS",
   "decimals": 18,
   "total_supply": 1000000000
 }
```
 
#### Get Smart Contract History
 ``` javascript
 let scAddress = '0x9d539c8534c156d76828992fd55a16f79afa9a36';
 let offset = 1;
 let limit = 10;
 let result = wallet.getContractHistory(scAddress, offset, limit);
 ```
 
 Response
```
{
   "total": 14224,
   "from": 0,
   "to": 9,
   "transactions": [
     {
       "tx_id": "0x3765012f73d1039976d237fe4a34ff877c9969cc0fe0d4a646c71826c3cf227e",
       "time": 1526627393,
       "value": 729286314819908800000,
       "from_addr": "0xcf1cc6ed5b653def7417e3fa93992c3ffe49139b",
       "to_addr": "0xc3e92d509e89b72fa5a340e24c9d34c8e1cb8729"
     }
   ]
 }
```
 
 #### Get Smart Contract Balance
 ``` javascript
 let scAddress = '0x9d539c8534c156d76828992fd55a16f79afa9a36'; 
 let result = wallet.getContractBalance(scAddress);
 ```
 
Response
```
{
   "addr": "",
   "balance": 0
 }
```
 
 #### CallFunction Smartcontract
 ```javascript
  let contractAddress = '0x464e3e8c11082dc80507e11886e58afe65af4c4e';
  let to = '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c';
  let amount = 1000;
  let txParams = {};
  txParams.sc = {}; 
  txParams.sc.contractAddress = contractAddress;
  txParams.sc.nameFunc = 'transferTo';
  txParams.sc.typeParams = ['address', 'uint256'];
  txParams.sc.paramsFuncs = [to, amount];

  let rawTx = await wallet.createRawTx(txParams);
  let result = await wallet.send({
    rawTx: rawTx,
    isBroadCast: true
  });
  
 ```
 
 Response
```
{
   raw: '',
   tx_id: '', 
}
```
 
### NEO.
#### Create instanse of Wallet
```javascript
const { Wallet, CoinType, InfinitoApi } = require('node-infinito-wallet');
let apiConfig = {
  apiKey: 'test',
  secret: '123456',
  baseUrl: 'https://staging-api-testnet.infinitowallet.io',
  logLevel: 'NONE'
}

///if you have privateKey then supply private key to create wallet or you can pass passphrase to create wallet 
let walletConfig = {
  coinType: CoinType.NEO.symbol, 
  isTestNet: true,
  privateKey:   'cVg2gYrsfHBf4iBWncrm86VHd1VqcUCFdJ9FJtLbdLfwvqc1eL6v'
}
 
// Note: need to set InfinitoApi
let api = new InfinitoApi(apiConfig);
let wallet = new Wallet(walletConfig);
wallet.setApi(api);
 ```
Beside functions like Bitcoin, Neo support some functions below

#### GetBalance
 ``` javascript
 let assetId = 'ASe43ZxsveYDhVEt2SYtRXRNtx17QZEu9C'; 
 let result = wallet.getBalance(assetId);
 ```
 
 Response
```
{
       "addr": "AMv25ohfCzzZiLPV3BkLKzNeNBYYoJJ7KD",
       "assets": [
           {
               "asset_id": "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
               "balance": "40"
           }
       ]
   }
```
 
 #### getClaimable
 ``` javascript 
 let result = wallet.getClaimable();
 ```
 
Response
```
{
   "transactions": [
     {
       "tx_id": "ccd53d43408c594cccc1d833821fb7ee1cca5571fd2571727365c42e893f2b08",
       "vout": 1,
       "unclaimed": 0.72814156
     }
   ]
 }
```
 
 #### getUnclaimed
 ``` javascript 
 let result = wallet.getUnclaimed();
 ```
 
Response
```
{
   "addr": "AMv25ohfCzzZiLPV3BkLKzNeNBYYoJJ7KD",
   "available": 0.97811485,
   "unavailable": 0.0795184
}
```
 
 #### getContractInfo
 ``` javascript 
 let scAddress = '0x9d539c8534c156d76828992fd55a16f79afa9a36';
 let result = wallet.getContractInfo(scAddress);
 ```
 Response
 ```
 {
       "address": "ac116d4b8d4ca55e6b6d4ecce2192039b51cccc5",
       "name": "Zeepin Token",
       "symbol": "ZPT",
       "decimals": 8,
       "total_supply": 1000000000
 }
```
 
#### getContractBalance
 ``` javascript 
 let scAddress = '0x9d539c8534c156d76828992fd55a16f79afa9a36';
 let result = wallet.getContractBalance(scAddress);
 ```
 Response
 ```
 {
            "addr":"AMv25ohfCzzZiLPV3BkLKzNeNBYYoJJ7KD",
            "Balance":3397
}
 ```
 
#### getContractHistory
 ``` javascript 
 let scAddress = '0x9d539c8534c156d76828992fd55a16f79afa9a36';
 let offet =1;
 let limit =10;
 let result = wallet.getContractHistory(scAddress,offet,limit);
 ```
 
  Response
 ```
 {
       "total": 20,
       "from": 0,
       "to": 9,
       "transactions": [
           {
               "tx_id": "0xe39535cca27e83c7a58dc9066fc21eba18f9c9d865052ca71fd62066f13d8199",
               "from_addr": "AV7M2KuWGHpGwc4LrmgGNA19BU3mhcVCDR",
               "to_addr": "AMv25ohfCzzZiLPV3BkLKzNeNBYYoJJ7KD",
               "value": "10",
               "time": "1526616715"
           }]
      }
 ```
 
#### tranfer 
 ``` javascript
let result = await wallet.transfer('0x9d539c8534c156d76828992fd55a16f79afa9a36', '0xe0bcec523eb3661cfd8a349330f04955c9a2ed6c', 10000);
 ```
  Response
```
{
   raw: '',
   tx_id: '', 
}
```
  
#### claim
 ``` javascript 
 let result = wallet.claim();
 ```
  Response
```
{
   raw: '',
   tx_id: '', 
}
```

# How to set up with React Native

This is a [simple guide](./config-react-native.md) to get you started with using `node-infinito-wallet` with the `React Native` project.