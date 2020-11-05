import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3';
import './App.css';
import Navbar from './Navbar';
// Web3.js connects to the blockchain
// metamask will connect the browser to the blockchain

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
    }
  }
  async componentWillMount() { // WARNING: deprecated method
    await this.loadWeb3();
    await this.loadBlockchainData()
  }
  // medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  // looks for a
  async loadWeb3() {
    // metamask => web3 looks
    // Modern dapp browsers...
    if (window.ethereum) {  // looks for an ethereum provider inside user's window
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        window.web3.eth.sendTransaction({/* ... */ });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) { // if there is no ethereum provider it creates one with web3
      window.web3 = new Web3(window.web3.currentProvider);
      // Acccounts always exposed
      window.web3.eth.sendTransaction({/* ... */ });
    }
    // Non-dapp browsers...
    else {  // No metamask? Ask to please install it...
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  // load account information
  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });  // set the first account in list to state
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
