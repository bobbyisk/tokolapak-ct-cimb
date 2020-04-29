import React from "react";
import { connect } from "react-redux";
import Axios from "axios";

import "./Cart.css";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button"

class Cart extends React.Component {
    state = {
        cartData: []
    }

    componentDidMount() {
        this.getCartHandler();
    }

    getCartHandler = () => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            },
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ cartData: res.data })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    deleteCartHandler = (id) => {
        Axios.delete(`${API_URL}/carts/${id}`)
            .then((res) => {
                console.log(res);
                alert("Deleted.");
                // this.setState({ cartData: [res.data] })
                this.getCartHandler();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // renderCart = () => {
    //     return 
    // }

    render() {
        return (
            <div className="container">
                {/* <div>Cart</div> */}
                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.cartData.map((val) => {
                                return (
                                    <tr key={`cart-${val.id}`}>
                                        <td>
                                            <img
                                                style={{ width: "100%", objectFit: "contain", height: "150px" }}
                                                src={val.product.image}
                                            />
                                        </td>
                                        <td>{val.product.productName}</td>
                                        <td>{val.quantity}</td>
                                        <td>
                                            {
                                                new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(val.product.price)
                                            }
                                        </td>
                                        <td>
                                            <ButtonUI type="contained" onClick={() => this.deleteCartHandler(val.id)}>Delete</ButtonUI>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Cart);