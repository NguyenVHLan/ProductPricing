import React, { Component } from 'react';
import Web3 from 'web3';
import ProductPricing from 'contracts/artifacts/ProductPricing.json';
import Main from './Main';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = ProductPricing.networks[networkId]
    if(networkData) {
      const productPricing = web3.eth.Contract(ProductPricing.abi, networkData.address)
      this.setState({ productPricing })
      const productRatingCount = await productPricing.methods.productRatingCount().call()
      this.setState({ productRatingCount })
      const numberProduct = await productPricing.methods.getNumberProduct().call()
      this.setState({ numberProduct })
      // Load products
      for (var i = 1; i <= productRatingCount; i++) {
        const product = await productPricing.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
      // load productInfo
      for (var i = 1; i <= numberProduct; i++) {
        const productInfo = await productPricing.methods.getInfoProduct(i).call()
        this.setState({
          productInfos : [...this.state.productInfos, productInfo]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('ProductPricing contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productRatingCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
    this.setPrice = this.setPrice.bind(this)
    this.stopPricing = this.stopPricing.bind(this)
  }

  createProduct(name, price, time, picAdd) {
    this.setState({ loading: true })
    this.state.productPricing.methods.createProduct(name, price, time, picAdd).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  setPrice(id, price) {
    this.setState({ loading: true })
    this.state.productPricing.methods.setPrice(id, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  stopPricing(id){
    this.setState({ loading: true })
    this.state.productPricing.methods.stopPricing(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  products={this.state.products}
                  productInfos={this.state.productInfos}
                  createProduct={this.createProduct}
                  setPrice={this.setPrice}
                  stopPricing={this.stopPricing} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
