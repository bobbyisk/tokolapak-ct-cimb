import React from "react";
import "./AdminDashboard.css";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { Table, Alert } from "reactstrap";
export default class AdminReports extends React.Component {

    state = {
        transactionsData: [],
        userIdTemp: [],
        transactionDetailsData: []
    }

    getTransactionsData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "finished",
                _expand: "user"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ transactionsData: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // getTransactionDetailsData = () => {
    //     Axios.get(`${API_URL}/transaction_details`, {
    //         params: {
    //             _expand: "user"
    //         }
    //     })
    //         .then((res) => {
    //             console.log(res.data);
    //             this.setState({ transactionDetailsData: res.data })
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }

    sumTotalPrice = (userId) => {
        let total = 0
        this.state.transactionsData.map((val) => {
            if (val.userId == userId) {
                total += val.totalPrice
            }
        })
        return total
    }

    renderTransactionsData = () => {
        return this.state.transactionsData.map((val, idx) => {
            const { user, totalPrice, status, userId } = val
            const { username } = user
            let total = 0

            if (!this.state.userIdTemp.includes(userId)) {
                this.state.userIdTemp.push(userId)
                return (
                    <>
                        <tr>
                            <td>{username}</td>
                            <td>{status}</td>
                            <td>{
                                new Intl.NumberFormat(
                                    "id-ID",
                                    { style: "currency", currency: "IDR" }).format(this.sumTotalPrice(userId))
                            }</td>
                        </tr>
                    </>
                )

            }
            // }
        })
    }

    componentDidMount() {
        this.getTransactionsData()
    }

    render() {
        return (
            <div className="container py-4">
                <Table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Status</th>
                            <th>All of Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTransactionsData()}
                    </tbody>
                </Table>
            </div>
        )
    }
}
