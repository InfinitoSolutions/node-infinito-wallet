# Documentation

- For Documentation, visit https://platform.infinito.io/docs/

# Example

- Create wallet
```javascript
let apiConfig = {
  apiKey: '01f33f56-a2ad-438d-9582-94005439a8b0',
  secret: 'rez2jA3lkWJrMGaxd8GUvwWq6dMLD0gV',
  baseUrl: 'https://sandbox-api.infinito.io'
}

// Config wallet
let walletConfig = {
  coinType: CoinType.BTC.symbol, //change for case LTC, DOGE, DASH, etc
  isTestNet: true,
  privateKey: 'cQw4uGgBj1WXYcHMBvHjJ73fssx7UNMaZXtKwtdWsWYyajCLadg5',
  // mnemonic: '<YOUR 12 words passphrase>'
}

// Create wallet instance.
let wallet = new Wallet(walletConfig);

// Config Infinito API
let api = new InfinitoApi(apiConfig);
wallet.setApi(api);

(async() => {
  console.log('wallet.getAddress() :', wallet.getAddress());
  console.log('wallet.getBalance() :', await wallet.getBalance());

  // Send transaction
  await wallet.send({
    txParams: {
      to: 'mz4dTmR6xsxKb5PPMbS3LnW8ED9ukUqm4T',
      feeType: 'high',
      amount: 1
    },
    isBroadCast: true
  });

  // Create transaction
  // Use custom utxo
  let listUnspent = [{
      'tx_id': '8c294813a97bf6401c16b89f6873c35fc936eae0f686431c0cce59d439656a2c',
      'vout': 0,
      'scriptpubKey': '76a9141a174aff039e61c1bae6a29d616ab765a1b6ea5b88ac',
      'amount': 100000,
      'confirmations': 1
    },
    {
      'tx_id': '37c58e1ec5712c8e95dd7ec88172efbba567aedae83efddfdc1ca5a28aed3774',
      'vout': 1,
      'scriptpubKey': '76a9141a174aff039e61c1bae6a29d616ab765a1b6ea5b88ac',
      'amount': 10000,
      'confirmations': 2
    },
    {
      'tx_id': 'd2d201f255dc7643303e9bd61a8fccfbc37b8f80a3988560b3260cf452960c1e',
      'vout': 1,
      'scriptPubKey': '76a9141a174aff039e61c1bae6a29d616ab765a1b6ea5b88ac',
      'amount': 10000,
      'confirmations': 2
    }
  ];
  let result = await wallet.createRawTxWithManyOutput({
    tos: [{
        to: 'mhtumTtXJXkKHeCgpMcqCeVi2VkHS7uQ3o',
        amount: 1000,
      },
      {
        to: 'mhtumTtXJXkKHeCgpMcqCeVi2VkHS7uQ3o',
        amount: 2000,
      },
    ],
    fee: 5,
    listUnspent // Optional
  });
  console.log('result', result);
})();
```