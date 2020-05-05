import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import "./ProductDetails.css";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { addCartQuantity } from "../../../redux/actions/qtycart";

class ProductDetails extends React.Component {
  state = {
    productData: {
      image: "",
      productName: "",
      price: 0,
      desc: "",
      category: "",
      id: 0,
    },
    // cartData: []
  };

  addToCartHandler = () => {
    // POST method ke /cart
    // Isinya: userId, productId, quantity
    // console.log(this.props.user.id);
    console.log(this.props.user.id)
    console.log(this.state.productData.id);

    // if (this.props.user.cookieChecked == true) {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        productId: this.state.productData.id,
      }
    })
      .then((res) => {
        console.log(res.data);
        console.log(res.data.length);
        if (res.data.length > 0) {
          Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
            quantity: res.data[0].quantity + 1
          })
            .then((res) => {
              console.log(res);
              swal("Add to cart", "Your item has been added to your cart", "success");
              this.cartQuantityHandler()
            })
            .catch((err) => {
              console.log(err)
            });
        } else {
          Axios.post(`${API_URL}/carts`, {
            userId: this.props.user.id,
            productId: this.state.productData.id,
            quantity: 1
          })
            .then((res) => {
              console.log(res);
              swal("Add to cart", "Your item has been added to your cart", "success");
              this.cartQuantityHandler()
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      })
    // }
  }

  addToWishlistHandler = () => {
    Axios.get(`${API_URL}/wishlist`, {
      params: {
        userId: this.props.user.id,
        productId: this.state.productData.id,
      }
    })
      .then((res) => {
        if (res.data.length > 0) {
          swal("Your item is already on the wishlist");
        } else {
          Axios.post(`${API_URL}/wishlist`, {
            userId: this.props.user.id,
            productId: this.state.productData.id,
          })
            .then((res) => {
              console.log(res);
              swal("Add to wishlist", "Your item has been added to your wishlist", "success");
              this.cartQuantityHandler()
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      })

  }

  cartQuantityHandler = () => {
    let total = 0
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        // _expand: "product",
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

  //   Axios.post(`${API_URL}/carts`, {
  //     userId: this.props.user.id,
  //     productId: this.state.productData.id,
  //     quantity: 1,
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       swal("Add to cart", "Your item has been added to your cart", "success");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  componentDidMount() {
    this.cartQuantityHandler()
    Axios.get(`${API_URL}/products/${this.props.match.params.productId}`)
      .then((res) => {
        this.setState({ productData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {
      productName,
      image,
      price,
      desc,
      category,
      id,
    } = this.state.productData;
    return (
      <div className="container">
        <div className="row py-4">
          <div className="col-6 text-center">
            <img
              style={{ width: "100%", objectFit: "contain", height: "550px" }}
              src={image}
              alt=""
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center">
            <h3>{productName}</h3>
            <h4>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price)}
            </h4>
            <p className="mt-4">{desc}</p>
            {/* <TextField type="number" placeholder="Quantity" className="mt-3" /> */}
            <div className="d-flex flex-row mt-4">
              <ButtonUI onClick={this.addToCartHandler}>Add To Cart</ButtonUI>
              <ButtonUI onClick={this.addToWishlistHandler} className="ml-4" type="outlined">
                Add To Wishlist
                </ButtonUI>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);