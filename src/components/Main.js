import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          const creationTime = window.web3.utils.toWei(this.creationTime.value.toString(), 'Ether')
          const picAdd = this.picAdd.value
          this.props.createProduct(name, price, creationTime, picAdd)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="creationTime"
              type="text"
              ref={(input) => { this.creationTime = input }}
              className="form-control"
              placeholder="Creation Time"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="picAdd"
              type="text"
              ref={(input) => { this.picAdd = input }}
              className="form-control"
              placeholder="Pic Add" 
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">NumRating</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.productInfos.map((productInfo, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{productInfo.id.toString()}</th>
                  <td>{productInfo.name}</td>
                  <td>{window.web3.utils.fromWei(productInfo.price.toString(), 'Ether')} Eth</td>
                  <td>{productInfo.numRatings.toString()}</td>
                  <td>
                    { productInfo.active
                      ? <button
                          id={productInfo.id}
                          onClick={(event) => {
                            this.props.stopPricing(event.target.id)
                          }}
                        >
                          Stop
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p>&nbsp;</p>
        <h3>Set Price</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
          const id = window.web3.utils.toWei(this.productId.value.toString(), 'Ether')
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.setPrice(id, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productId"
              type="text"
              ref={(input) => { this.productId = input }}
              className="form-control"
              placeholder="Product Id"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Set Price</button>
        </form>
      </div>
    );
  }
}

export default Main;
