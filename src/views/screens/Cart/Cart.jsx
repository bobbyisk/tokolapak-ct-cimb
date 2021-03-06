import React from "react";
import { connect } from "react-redux";
import swal from "sweetalert";
import "./Cart.css";

import { Table, Alert, Button } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { addCartQuantity } from "../../../redux/actions/qtycart";

class Cart extends React.Component {
  state = {
    cartData: [],
    isCheckout: false,
    totalPrice: 0,
    totalKirim: 0,
    checkoutItems: []
  };

  inputHandler = (e, field) => {
    let { value } = e.target;
    this.setState({
      ...this.state,
      [field]: value,
    });
    // alert(parseInt(this.state.totalKirim) + parseInt(this.state.totalPrice))
  };

  getCartData = () => {
    let total = 0;
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        console.log(res.data);
        res.data.map((val) => {
          return total += val.quantity * val.product.price
        })
        this.setState({ cartData: res.data, totalPrice: total });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  checkboxHandler = (e, idx) => {
    const { checked } = e.target;

    if (checked) {
      this.setState({ checkoutItems: [...this.state.checkoutItems, idx] })
    } else {
      this.setState({
        checkoutItems: [
          ...this.state.checkoutItems.filter((val) => val !== idx)
        ]
      })
    }
  }

  cartQuantityHandler = () => {
    let total = 0
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        console.log("Ini buar cart qty: " + res.data);
        // res.data.map((val) => {
        //   return total += val.quantity
        // })
        total += res.data.length
        this.setState({ cartData: res.data });
        this.props.onCart(total);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderCartData = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val;
      const { productName, image, price } = product;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>
            {
              new Intl.NumberFormat(
                "id-ID",
                { style: "currency", currency: "IDR" }).format(price)
            }
          </td>
          <td>{quantity}</td>
          <td>
            {" "}
            <img
              src={image}
              alt=""
              style={{ width: "100px", height: "200px", objectFit: "contain" }}
            />{" "}
          </td>
          <td>
            <ButtonUI
              type="outlined"
              onClick={() => this.deleteCartHandler(id)}
            >
              Delete Item
            </ButtonUI>
          </td>
          <td>
            <input
              type="checkbox"
              onChange={(e) => this.checkboxHandler(e, idx)}
              className="form-control"
            />
          </td>
        </tr>
      );
    });
  };

  renderCheckout = () => {
    let total = 0;
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val;
      const { productName, image, price } = product;
      total = quantity * price

      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>
            {
              new Intl.NumberFormat(
                "id-ID",
                { style: "currency", currency: "IDR" }).format(price)
            }
          </td>
          <td>{quantity}</td>
          <td>
            {
              new Intl.NumberFormat(
                "id-ID",
                { style: "currency", currency: "IDR" }).format(total)
            }
          </td>
        </tr>
      );
    });
  }

  deleteCartHandler = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.cartQuantityHandler()
        this.getCartData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  confirmHandler = () => {
    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.user.id,
      totalPrice: parseInt(this.state.totalKirim) + parseInt(this.state.totalPrice),
      status: "pending",
      buyDate: new Date().toLocaleDateString(),
      buyEndDate: "-",
    })
      .then((res) => {
        console.log(res);
        this.state.cartData.map((val) => {
          Axios.post(`${API_URL}/transaction_details`, {
            transactionId: res.data.id,
            productId: val.product.id,
            price: val.product.price,
            quantity: val.quantity,
            totalPrice: val.product.price * val.quantity
          })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            })
        })
        swal("Finished", "Thank you.", "success");
        this.state.cartData.map((val) => {
          return this.deleteCartHandler(val.id)
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  componentDidMount() {
    this.cartQuantityHandler()
    this.getCartData();
  }

  render() {
    return (
      <div className="container py-4">
        {this.state.cartData.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{this.renderCartData()}</tbody>
            </Table>
            <ButtonUI type="contained" onClick={() => this.setState({ isCheckout: true })}>Checkout</ButtonUI>
            <br />
            {this.state.isCheckout ?
              <div>
                <Table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderCheckout()}
                  </tbody>
                </Table>
                <Table>
                  <thead>
                    <tr>
                      <th>Total Price</th>
                      <th>Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {
                          new Intl.NumberFormat("id-ID",
                            { style: "currency", currency: "IDR" }).format((parseInt(this.state.totalKirim) + parseInt(this.state.totalPrice)))
                        }
                      </td>
                      <td>
                        <select
                          value={this.state.totalKirim}
                          className="custom-text-input"
                          onChange={(e) => this.inputHandler(e, "totalKirim")}
                        >
                          <option value={100000}>Instant</option>
                          <option value={50000}>Same Day</option>
                          <option value={20000}>Express</option>
                          <option value={0}>Economy</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <ButtonUI type="contained" onClick={() => this.confirmHandler()}>Confirm</ButtonUI>
              </div> : null
            }
          </>
        ) : (
            <Alert>
              Your cart is empty! <Link to="/">Go shopping</Link>
            </Alert>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  onCart: addCartQuantity
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);