import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [btcWallet, setBTCWallet] = useState('')

  const createBTCWallet = async () => {
    const BTCBuilder = new window.WalletBuilder('BTC')
    const btcWallet = await BTCBuilder.build()
    setBTCWallet(JSON.stringify(btcWallet))
  }
  return (
    <div className="App" style={{marginTop: 100}}>
      <div>
        <div>======Create BTC Wallet======</div>
        <button onClick={createBTCWallet} style={{marginTop: 15}}>Create BTC Wallet</button>
        <div style={{marginTop: 15}}>
          <textarea value={btcWallet} style={{width: 500, height: 200}}/>
        </div>
      </div>
    </div>
  );
}

export default App;
