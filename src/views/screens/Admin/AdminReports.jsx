import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";
import { connect } from "react-redux";
import { addCartQuantity } from "../../../redux/actions/qtycart";
import { Table, Alert } from "reactstrap";

export default class AdminReports extends React.Component {

    state = {
        transactionsData: [],
        userNameTemp: [],
        totalBelanja: {},
        dataBeneran: [],
        transactionDetailsData: []
    }

    getTransactionsData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
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

    renderTransactionsData = () => {
        return this.state.transactionsData.map((val, idx) => {
            const { user, totalPrice, status, userId } = val
            const { username } = user
            let total = 0
            // if (status == "finished") {
            //     if (this.state.userName.includes(username)) {
            //         total = totalPrice + this.state.totalBelanja.username
            //         this.state.userNameTemp.push(username)
            //         this.state.totalBelanja.setState({ ...this.state.totalBelanja, username: total })
            //     } else {
            //         total = 0
            //         total = totalPrice
            //         this.state.userNameTemp.push(username)
            //         this.state.userNameTemp.push(username)
            //         this.state.totalBelanja.setState({ ...this.state.totalBelanja, username: totalPrice })
            //         // return (
            //         //     <>
            //         //         <tr>
            //         //             <td>{username}</td>
            //         //             <td>{status}</td>
            //         //             <td>{total}</td>
            //         //         </tr>
            //         //     </>
            //         // )
            //     }

            // }
            if (status == "finished") {
                return (
                    <>
                        <tr>
                            <td>{username}</td>
                            <td>{status}</td>
                            <td>{
                                new Intl.NumberFormat(
                                    "id-ID",
                                    { style: "currency", currency: "IDR" }).format(totalPrice)
                            }</td>
                        </tr>
                    </>
                )
            }
        })
    }

    // renderBeneran = () => {
    //     this.state.dataBeneran.push(this.state.totalBelanja)
    //     console.log(this.state.dataBeneran)
    //     return this.state.dataBeneran.map((val, idx) => {
    //         return (
    //             <>
    //                 <tr>
    //                     <td>{val.username}</td>
    //                     <td>{val.totalPrice}</td>
    //                 </tr>
    //             </>
    //         )
    //     })
    // }

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
