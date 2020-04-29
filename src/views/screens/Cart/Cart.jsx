import React from "react";
import { connect } from "react-redux";
import Axios from "axios";

import "./Cart.css";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button"

class Cart extends React.Component {
    componentDidMount() {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            },
        })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        // Axios.get(`${API_URL}/products/1`, {
        //   params: {
        //     _embed: "carts",
        //   },
        // })
        //   .then((res) => {
        //     console.log(res.data);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
    }

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
                        {}
                        <tr>
                            <td>gambar</td>
                            <td>iPhone</td>
                            <td>1</td>
                            <td>5000000</td>
                            <td><ButtonUI type="contained">Delete</ButtonUI></td>
                        </tr>
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