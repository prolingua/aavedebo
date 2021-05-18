import { Tabs, Tab,Table, Container, Row, Col, Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import AaveDeBo from '../abis/AaveDeBo.json';
import iERC20 from '../abis/IERC20.json';
import Web3 from 'web3';
import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

const web3 = new Web3(window.ethereum);

const ether = (n) => {
  return new Web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
};

const tokens = (n) => ether(n);

class App extends Component {
  
  async componentDidMount() {
    await this.loadBlockchainData();
  }

  
  async loadBlockchainData() {
    //check if Metamask exists
    this.setState({loading:true});
    if(typeof(window.ethereum !== 'undefined')){
                  
      const networkId = await web3.eth.net.getId();
      console.log(networkId);

      const accounts = await web3.eth.requestAccounts();
      console.log(accounts[0]);
      const account = accounts[0];

      if(typeof accounts[0] !== 'undefined'){
        try{
          const etherBalance = await web3.eth.getBalance(accounts[0]);
          console.log(etherBalance);
  
          const dai = new web3.eth.Contract(iERC20.abi, daiAddress);
          const daiBalance = await dai.methods.balanceOf(accounts[0]).call();
          console.log(daiBalance);

          console.log(AaveDeBo.networks[networkId].address);
          const aaveDeBo = new web3.eth.Contract(AaveDeBo.abi, AaveDeBo.networks[networkId].address);

          this.setState({dai, aaveDeBo, etherBalance, daiBalance, account })
        }
        catch(err){
          this.setState({loading:false});
          alert(err);
        }        
      }
      else{
        this.setState({loading:false});
        alert('Please login with MetaMask');
      }
    }
    else{
      this.setState({loading:false});
      window.alert('Please install Metamask');
    }
    this.setState({loading:false});
  }


  async depositEther(e){
    e.preventDefault();
    console.log(this.state.etherToDeposit);

    const etherToDeposit = ether(this.state.etherToDeposit);
    
    const daiToBorrow = ((this.state.etherToDeposit * 3600 * 3) / 4).toFixed(0) ;
    console.log(daiToBorrow);
    this.setState({loading:true});
    try{
      await this.state.aaveDeBo.methods.depositETHAndBorrowDAI(tokens(daiToBorrow)).send({value: etherToDeposit.toString(), from: this.state.account});
      const etherBalance = await web3.eth.getBalance(this.state.account);  
      const daiBalance = await this.state.dai.methods.balanceOf(this.state.account).call();
      this.setState({loading:false, etherBalance, daiBalance});       
    }
    catch(err){
      console.log(err);
      this.setState({loading:false});
    }    
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: '',
      account:'',
      dai: null,
      aaveDeBo: null,
      etherBalance:'0',
      daiBalance:'0',
      loading: false,
      etherToDeposit:0
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
              <div  style={{marginTop:'100px', marginLeft:'200px'}}>
                <Container>
                  <Row>
                    <Col xs={3}>Address</Col>
                    <Col>{this.state.account}</Col>
                  </Row>
                  <Row>
                    <Col xs={3}>Ether Balance</Col>
                    <Col>{this.state.loading ? <Spinner size="sm" animation="border"/> : web3.utils.fromWei(this.state.etherBalance)}</Col>
                  </Row>
                  <Row>
                    <Col xs={3}>Dai Balance</Col>
                    <Col>{this.state.loading ? <Spinner size="sm" animation="border"/> : web3.utils.fromWei(this.state.daiBalance)}</Col>
                  </Row>
                  <Row style={{height: '10px'}}>                    
                  </Row>
                  <Row>
                    <Col xs={3}>Deposit Ether</Col>
                    <Col><input type="number" step='0.01' min='0' value={this.state.etherToDeposit} onChange={ (e) => {console.log(e.target.value); this.setState({etherToDeposit:e.target.value})}}/>&nbsp;<Button variant="primary" disabled={this.state.loading} onClick={ (e) => this.depositEther(e)} >Submit</Button></Col>
                  </Row>
                </Container>                
              </div>
        </div>
      </div>
    );
  }
}

export default App;
