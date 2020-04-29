import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import './Cart.css';
import { API_URL } from '../../../constants/API.js'

class Cart extends React.Component {
    componentDidMount() {
        Axios.get(`${API_URL}/cart`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            }
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className="container" >
                <div>Cart</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Cart);