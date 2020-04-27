import React from 'react';
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import { connect } from "react-redux";
import { loginHandler } from "../../../redux/actions";
import { registerHandler } from "../../../redux/actions";

class AuthScreen extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        repPassword: "",
        isLogin: true,
    }

    inputHandler = (event, field) => {
        const { value } = event.target;
        this.setState({ [field]: value });
    }

    loginHandler = () => {
        const { username, password } = this.state;
        const userData = {
            username,
            password,
        };

        this.props.onLogin(userData);
    }

    registerHandler = () => {
        const { username, email, password, repPassword } = this.state
        let newUser = {
            username,
            email,
            password,
            repPassword,
        }
        alert(newUser.username)
        this.props.onRegister(newUser)
    }

    render() {
        if (this.state.isLogin == true) {
            return (
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-5">
                            <div>
                                <div className="d-flex">
                                    <ButtonUI
                                        type="contained"
                                        className="mr-2"
                                        onClick={() => this.setState({ isLogin: true })}>Login
                                    </ButtonUI>
                                    <ButtonUI
                                        type="outlined"
                                        onClick={() => this.setState({ isLogin: false })}>Register
                                    </ButtonUI>
                                </div>
                                <h3 className="mt-4">Log In</h3>
                                <p className="mt-4">
                                    Welcome back.
                                    <br />Please, login to your account.
                                </p>
                                <TextField placeholder="Username" className="mt-5" onChange={(e) => this.inputHandler(e, "username")} />
                                <TextField placeholder="Password" className="mt-2" onChange={(e) => this.inputHandler(e, "password")} />
                                <div className="d-flex justify-content-center">
                                    <ButtonUI type="contained" className="mt-4 align-self-center" onClick={this.loginHandler}>Login</ButtonUI>
                                </div>
                            </div>
                        </div>
                        <div className="col-7">Picture</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-5">
                            <div>
                                <div className="d-flex">
                                    <ButtonUI
                                        type="outlined"
                                        className="mr-2"
                                        onClick={() => this.setState({ isLogin: true })}>Login
                                    </ButtonUI>
                                    <ButtonUI
                                        type="contained"
                                        onClick={() => this.setState({ isLogin: false })}>Register
                                    </ButtonUI>
                                </div>
                                <h3 className="mt-4">Register</h3>
                                <p className="mt-4">
                                    You will get the best recommendation for rent
                                    <br />house in near of you.
                                </p>
                                <TextField placeholder="Name" className="mt-5" onChange={(e) => this.inputHandler(e, "username")} />
                                <TextField placeholder="Email" className="mt-2" onChange={(e) => this.inputHandler(e, "email")} />
                                <TextField placeholder="Password" className="mt-2" onChange={(e) => this.inputHandler(e, "password")} />
                                <TextField placeholder="Confirm Password" className="mt-2" onChange={(e) => this.inputHandler(e, "repPassword")} />
                                <div className="d-flex justify-content-center">
                                    <ButtonUI type="contained" className="mt-4 align-self-center" onClick={this.registerHandler}>Register</ButtonUI>
                                </div>
                            </div>
                        </div>
                        <div className="col-7">Picture</div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
}

const mapDispatchToProps = {
    onLogin: loginHandler,
    onRegister: registerHandler,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
