import React from 'react'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Table, Alert } from "reactstrap";
import swal from 'sweetalert';
import { connect } from "react-redux";
import { addCartQuantity } from "../../../redux/actions/qtycart";

class AdminPayment extends React.Component {
    state = {
        activePage: "Pending",
        paymentData: [],
    }

    getPaymentData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                _embed: "transaction_details",
                _expand: "user"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ paymentData: res.data })
                console.log(this.state.paymentData)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    renderPaymentData = () => {
        const { activePage } = this.state;

        if (activePage == "Pending") {
            return this.state.paymentData.map((val, idx) => {
                const { userId, totalPrice, status, buyDate, buyEndDate, id, user } = val;
                if (status == "pending") {
                    return (
                        <>
                            <tr>
                                <td>{user.username}</td>
                                <td>
                                    {
                                        new Intl.NumberFormat("id-ID",
                                            { style: "currency", currency: "IDR" }).format(totalPrice)
                                    }
                                </td>
                                <td>{status}</td>
                                <td>{buyDate}</td>
                                <td>{buyEndDate}</td>
                                <td><ButtonUI type="contained" onClick={() => { this.confirmPaymentBtn(val.id, val.status) }}>Confirm Payment</ButtonUI></td>
                            </tr>
                        </>
                    )
                }
            })
        } else {
            return this.state.paymentData.map((val, idx) => {
                const { userId, totalPrice, status, buyDate, buyEndDate, id, user } = val;
                if (status == "finished") {
                    return (
                        <>
                            <tr>
                                <td>{user.username}</td>
                                <td>
                                    {
                                        new Intl.NumberFormat("id-ID",
                                            { style: "currency", currency: "IDR" }).format(totalPrice)
                                    }
                                </td>
                                <td>{status}</td>
                                <td>{buyDate}</td>
                                <td>{buyEndDate}</td>
                                <td><ButtonUI type="contained" onClick={() => { this.confirmPaymentBtn(val.id, val.status) }}>Confirm Payment</ButtonUI></td>
                            </tr>
                        </>
                    )
                }
            })
        }
    }

    confirmPaymentBtn = (id, status) => {
        if (status == "finished") {
            swal("Payment was already Confirmed.");
        } else {
            Axios.patch(`${API_URL}/transactions/${id}`, {
                status: "finished",
                buyEndDate: new Date().toLocaleDateString()
            })
                .then((res) => {
                    console.log(res);
                    swal("Success!", "Payment Confirmed.", "success");
                    this.getPaymentData()
                })
                .catch((err) => {
                    console.log(err);
                })
        }
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
        this.getPaymentData()
    }

    render() {
        return (
            <div className="container py-4">
                {this.state.paymentData.length > 0 ? (
                    <>
                        <div className="d-flex flex-row">
                            <ButtonUI
                                className={`auth-screen-btn ${
                                    this.state.activePage == "Pending" ? "active" : null
                                    }`}
                                type="outlined"
                                onClick={() => this.setState({ activePage: "Pending" })}
                            >
                                Pending
                            </ButtonUI>
                            <ButtonUI
                                className={`ml-3 auth-screen-btn ${
                                    this.state.activePage == "Finished" ? "active" : null
                                    }`}
                                type="outlined"
                                onClick={() => this.setState({ activePage: "Finished" })}
                            >
                                Finished
                            </ButtonUI>
                        </div>
                        <br />
                        <Table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Date Bought</th>
                                    <th>Date Finished</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderPaymentData()}
                            </tbody>
                        </Table>
                    </>
                ) : (
                        <Alert>Empty payment confirmation.</Alert>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminPayment);
