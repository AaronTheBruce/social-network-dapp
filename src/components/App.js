import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';
// Web3.js connects to the blockchain
// metamask will connect the browser to the blockchain

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: []
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
    // web3.eth.defaultAccount = accounts[0]; // meant to resolve error, but create problem with Wallet not connecting
    this.setState({ account: accounts[0] });  // set the first account in list to state
    // Network id
    const networkId = await web3.eth.net.getId();
    const networkData = SocialNetwork.networks[networkId];

    if (networkData) {
      // create the social network smart contract
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork });
      const postCount = await socialNetwork.methods.postCount().call();
      this.setState({ postCount });
      console.log(postCount);
      // load posts
      for (let i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call();
        this.setState({
          posts: [...this.state.posts, post]
        }); // ES6 spread posts and add new post on the end
      }
      console.log({ posts: this.state.posts })
    }
    else {
      window.alert('SocialNetwork contract not deployed to the blockchain!')
    }
    // address
    // ABI
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px'}}>
              <div className="content mr-auto ml-auto">
                {this.state.posts.map((post, key) => {
                  return (
                    <div className="card mb-4" key={key}>
                      <div className="card-header">
                        <small className="text-muted">{post.author}</small>
                      </div>
                      <ul id="postList" className="list-group list-group-flush">
                        <li className="list-group-item">
                          <p>{post.content}</p>
                        </li>
                        <li key={key} className="list-group-item py-2">
                          <small className="float-left mt-1 text-muted">
                            TIPS: 1 ETH
                          </small>
                          <button className="btn btn-link btn-sm float-right pt-0">
                            <span>
                              TIP 0.1 ETH
                            </span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
