import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Identicon from 'identicon.js';
import Navbar from './Navbar';
import Main from './Main';
// Web3.js connects to the blockchain
// metamask will connect the browser to the blockchain

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }
    this.createPost = this.createPost.bind(this);
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
      // console.log(postCount);
      // load posts
      for (let i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call();
        this.setState({
          posts: [...this.state.posts, post]
        }); // ES6 spread posts and add new post on the end
      }
      this.setState({ loading: false });
      // console.log({ posts: this.state.posts })
    }
    else {
      window.alert('SocialNetwork contract not deployed to the blockchain!')
    }
    // address
    // ABI
  }


  createPost(content) {
    this.setState({ loading: true });
    console.log("loading set to true")
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .then((receipt) => {
      this.setState({ loading: false });
      console.log("loading set to false")
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading ?
          <div id="loader" className="text-center mt-5">Loading...</div> :
          <Main
            posts={this.state.posts}
            createPost={this.createPost}
          />
        }
      </div>
    );
  }
}

export default App;
