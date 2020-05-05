import React from 'react'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { Table, Button } from "reactstrap";
import { connect } from "react-redux";
import { addCartQuantity } from "../../../redux/actions/qtycart";

class AdminReports extends React.Component {

    state = {
        transactionsData: [],
        userIdTemp: [],
        transactionDetailsData: [],
        productIdAndQuantityData: [],
        productData: [],
        isClick: false
    }

    getTotalPrice = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "finished",
                _expand: "user",
                _embed: "transaction_details"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.state.transactionsData.push(...res.data)
                // this.setState({ transactionsData: res.data })

            })
            .catch((err) => {
                console.log(err);
            })
    }

    getTotalQuantity = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "finished",
                _embed: "transaction_details"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.state.transactionDetailsData.push(...res.data)
                console.log(this.state.transactionDetailsData)
                Axios.get(`${API_URL}/products`)
                    .then((res) => {
                        this.setState({ productData: res.data })
                        console.log(this.state.productData)

                        this.state.transactionDetailsData.map((val, idx) => {
                            val.transaction_details.map((val, idx) => {
                                this.state.productIdAndQuantityData.push([val.productId, val.quantity])
                                // console.log(this.state.productIdAndQuantityData)
                            })
                        })
                        // this.setState({ productIdAndQuantityData: [...this.state.productIdAndQuantityData] })
                        //  ^   ^   ^   ^
                        //  |   |   |   |
                        // CODE LINE DIATAS YANG SAYA COMMENT KALAU DI UN-COMMENT BISA RENDER UNTUK SOAL NO 8 bagian b
                        // TAPI KETIKA DI UN-COMMENT CODE YANG DIATAS, YANG SOAL NO 8 BAGIAN a MALAH GAK NGERENDER
                        // KALAU CODE LINE NYA DI COMMENT SEPERTI DIATAS, YANG NO 8 BAGIAN a MAU NGERENDER BISA DILIHAT DI APP NYA
                        // SEBENARNYA YANG SOAL NO 8 BAGIAN a DAN NO 8 BAGIAN b SUDAH BERJALAN FUNGSINYA, NAMUN SAYA SENDIRI TIDAK TAHU KENAPA 
                        // BARU KALI INI SAYA MENEMUKAN MASALAH SEPERTI INI, SUDAH DICOBA-COBA NAMUN MASIH BELUM DIKETAHUI KENAPA
                        console.log(this.state.productIdAndQuantityData)
                    })
                    .catch((err) => {
                    })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    toQuantity = () => {
        this.setState({ productIdAndQuantityData: [...this.state.productIdAndQuantityData] })
    }

    sumTotalPrice = (userId) => {
        let total = 0
        this.state.transactionsData.map((val) => {
            if (val.userId == userId) {
                total += val.totalPrice
            }
        })
        return total
    }

    getProductIdAndQuantity = () => {
        this.state.transactionDetailsData.map((val, idx) => {
            val.transaction_details.map((val, idx) => {
                this.state.productIdAndQuantityData.push([val.productId, val.quantity])
                // console.log(this.state.productIdAndQuantityData)
            })
        })

    }

    renderTransactionsData = () => {
        return this.state.transactionsData.map((val, idx) => {
            const { user, totalPrice, status, userId } = val
            const { username } = user

            if (!this.state.userIdTemp.includes(userId)) {
                this.state.userIdTemp.push(userId)
                return (
                    <>
                        <tr>
                            <td>{username}</td>
                            <td>{status}</td>
                            <td>
                                {
                                    new Intl.NumberFormat(
                                        "id-ID",
                                        { style: "currency", currency: "IDR" }).format(this.sumTotalPrice(userId))
                                }
                            </td>
                        </tr>
                    </>
                )
            }
        })
    }

    renderQuantityData = () => {
        console.log(this.state.productData)
        return this.state.productData.map((val, idx) => {
            const { productName, id } = val
            let quantity = 0

            this.state.productIdAndQuantityData.map((val, idx) => {
                if (val[0] == id) {
                    return quantity += val[1]
                }
            })
            return (
                <>
                    <tr>
                        <td>{productName}</td>
                        <td>{quantity}</td>
                    </tr>
                </>
            )
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
        this.getTotalPrice()
        this.getTotalQuantity()
    }

    render() {
        return (
            <div className="container py-4">
                <center>
                    <input className="my-3" type="button" value="Please Click to get the value in second table :)" onClick={() => this.toQuantity()} />
                </center>
                {/* <input type="button" value="Test" onClick={this.getProductIdAndQuantity} /> */}
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
                <Table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderQuantityData()}
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminReports)