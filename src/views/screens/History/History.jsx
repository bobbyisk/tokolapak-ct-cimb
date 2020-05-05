import React from 'react'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { Table, Alert } from "reactstrap";
import { connect } from "react-redux";
import { addCartQuantity } from "../../../redux/actions/qtycart";
import ButtonUI from "../../components/Button/Button";

class History extends React.Component {
    state = {
        historyData: [],
        historyDataDetails: [],
        activeUsers: [],
        totalPrice: 0,
        isDetail: false
    }

    getHistoryData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                userId: this.props.user.id,
                status: "finished",
                _embed: "transaction_details"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ historyData: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getHistoryDataDetails = (id) => {
        Axios.get(`${API_URL}/transaction_details`, {
            params: {
                transactionId: id,
                _expand: "product"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ historyDataDetails: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    renderHistoryData = () => {
        return this.state.historyData.map((val, idx) => {
            const { userId, totalPrice, status, buyDate, buyEndDate, id } = val;
            return (
                <>
                    <tr onClick={() => {
                        if (this.state.activeUsers.includes(idx)) {
                            this.setState({
                                activeUsers: [
                                    ...this.state.activeUsers.filter((item) => item !== idx),
                                ],
                            });
                        } else {
                            this.setState({
                                activeUsers: [...this.state.activeUsers, idx],
                            });
                        }
                    }}>
                        <td>{idx + 1}</td>
                        <td>
                            {
                                new Intl.NumberFormat(
                                    "id-ID",
                                    { style: "currency", currency: "IDR" }).format(totalPrice)
                            }
                        </td>
                        <td>{status}</td>
                        <td>{buyDate}</td>
                        <td>{buyEndDate}</td>
                        <td><ButtonUI onClick={() => this.detailsBtnHandler(id, totalPrice)} type="contained">Details</ButtonUI></td>
                    </tr>
                </>
            )
        })
    }

    renderHistoryDataDetails = () => {
        return this.state.historyDataDetails.map((val, idx) => {
            const { product, quantity, price, totalPrice } = val;
            const { productName } = product
            return (
                <>

                    <tr>
                        <td>{productName}</td>
                        <td>{
                            new Intl.NumberFormat(
                                "id-ID",
                                { style: "currency", currency: "IDR" }).format(price)
                        }</td>
                        <td>{quantity}</td>
                        <td>{
                            new Intl.NumberFormat(
                                "id-ID",
                                { style: "currency", currency: "IDR" }).format(totalPrice)
                        }</td>
                    </tr>
                </>
            )
        })
    }

    detailsBtnHandler = (id, totalPrice) => {
        this.setState({ totalPrice })
        this.getHistoryDataDetails(id);
        this.setState({ isDetail: true })
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
        this.getHistoryData()
    }


    render() {
        return (
            <div className="container py-4">
                {this.state.historyData.length > 0 ? (
                    <>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Date Bought</th>
                                    <th>Date Finished</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderHistoryData()}
                            </tbody>
                        </Table>
                        {this.state.isDetail ? (
                            <>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderHistoryDataDetails()}
                                    </tbody>
                                </Table>
                            </>
                        ) : (null)}
                    </>
                ) : (
                        <Alert>Empty history.</Alert>
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = {
    onCart: addCartQuantity
}

export default connect(mapStateToProps, mapDispatchToProps)(History);