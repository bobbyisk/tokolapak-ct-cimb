import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user"

const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS } = userTypes;

const cookieObj = new Cookie();

export const loginHandler = (userData) => {
    return (dispatch) => {
        const { username, password } = userData;

        Axios.get(`${API_URL}/users`, {
            params: {
                username,
                password,
            },
        })
            .then((res) => {
                if (res.data.length > 0) {
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data[0],
                    });
                    alert(`Halo, "${res.data[0].username}"`)
                } else {
                    dispatch({
                        type: ON_LOGIN_FAIL,
                        payload: "Username atau password salah",
                    });
                    alert("Username atau password salah");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const userKeepLogin = (userData) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                id: userData.id,
            },
        })
            .then((res) => {
                if (res.data.length > 0) {
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data[0],
                        // {
                        //   id,
                        //   username,
                        //   password,
                        //   fullName,
                        //   role
                        // }
                    });
                } else {
                    dispatch({
                        type: ON_LOGIN_FAIL,
                        payload: "Username atau password salah",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const logoutHandler = () => {
    cookieObj.remove("authData");
    return {
        type: ON_LOGOUT_SUCCESS,
    };
};

export const registerHandler = (userData) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                username: userData.username
            }
        })
            .then((res) => {
                if (res.data.length > 0) {
                    dispatch({
                        type: "ON_REGISTER_FAIL",
                        payload: "Username sudah digunakan",
                    });
                    alert("Username sudah digunakan")
                } else {
                    Axios.post(`${API_URL}/users`, userData)
                        .then((res) => {
                            console.log(res.data);
                            dispatch({
                                type: ON_LOGIN_SUCCESS,
                                payload: res.data
                            });
                            alert("Gokil")
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };
}
