import React from 'react'
import Axios from "axios";
import { connect } from "react-redux";
import swal from "sweetalert";

import { Table } from 'reactstrap'

import { API_URL } from "../../../constants/API";
import { addCartQuantity } from "../../../redux/actions/qtycart";
import ButtonUI from "../../components/Button/Button";

class Wishlist extends React.Component {
    state = {
        wishlistData: []
    }

    addToCartHandler = (productId) => {
        console.log("userId: " + this.props.user.id)
        console.log("productId: " + productId)
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                productId
            }
        })
            .then((res) => {
                console.log("Get dari: " + res.data);
                console.log(res.data.length)
                if (res.data.length > 0) {
                    Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
                        quantity: res.data[0].quantity + 1
                    })
                        .then((res) => {
                            console.log(res);
                            swal("Add to cart", "Masuk patch. Your item has been added to your cart", "success");
                            this.cartQuantityHandler()
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                } else {
                    Axios.post(`${API_URL}/carts`, {
                        userId: this.props.user.id,
                        productId,
                        quantity: 1
                    })
                        .then((res) => {
                            console.log(res);
                            swal("Add to cart", "Masuk post. Your item has been added to your cart", "success");
                            this.cartQuantityHandler();
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

    getWishlistData = () => {
        Axios.get(`${API_URL}/wishlist`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            },
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ wishlistData: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderWishlistData = () => {
        return this.state.wishlistData.map((val, idx) => {
            const { product, id, productId } = val;
            const { productName, image, price } = product;
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{productName}+</td>
                    <td>
                        {
                            new Intl.NumberFormat(
                                "id-ID",
                                { style: "currency", currency: "IDR" }).format(price)
                        }
                    </td>
                    <td>
                        {" "}
                        <img
                            src={image}
                            alt=""
                            style={{ width: "100px", height: "200px", objectFit: "contain" }}
                        />{" "}
                    </td>
                    <td>
                        <ButtonUI onClick={() => this.addToCartHandler(productId)} className="mb-2" type="contained">Add to cart</ButtonUI>
                        <ButtonUI onClick={() => this.deleteWishlistHandler(id)} type="outlined">Delete</ButtonUI>
                    </td>
                </tr>
            )
        })
    }

    deleteWishlistHandler = (id) => {
        Axios.delete(`${API_URL}/wishlist/${id}`)
            .then((res) => {
                this.getWishlistData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

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
                //     return total += val.quantity
                // })
                total += res.data.length
                // this.setState({ cartData: res.data });
                this.props.onCart(total);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.cartQuantityHandler()
        this.getWishlistData()
    }

    render() {
        return (
            <div className="container py-4">
                <Table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderWishlistData()}
                    </tbody>
                </Table>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
