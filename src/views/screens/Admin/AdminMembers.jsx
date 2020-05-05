import React from 'react';
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

import { connect } from "react-redux";
import { addCartQuantity } from "../../../redux/actions/qtycart";
import { throws } from 'assert';
import TextField from '../../components/TextField/TextField';

class AdminMembers extends React.Component {
    state = {
        userList: [],
        editMember: {
            id: 0,
            fullName: "",
            email: "",
            password: "",
            role: ""
        },
        activeUsers: [],
        modalOpen: false
    }

    getUserList = () => {
        Axios.get(`${API_URL}/users`)
            .then((res) => {
                this.setState({ userList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };

    editMemberBtnHandler = (idx) => {
        this.setState({
            editMember: {
                ...this.state.userList[idx],
            },
            modalOpen: true,
        });
    }

    editMemberHandler = () => {
        Axios.put(
            `${API_URL}/users/${this.state.editMember.id}`,
            this.state.editMember
        )
            .then((res) => {
                swal("Success!", "Member has been edited", "success");
                this.setState({ modalOpen: false });
                this.getUserList();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    deleteMembers = (id) => {
        Axios.delete(`${API_URL}/users/${id}`)
            .then((res) => {
                console.log(res);
                swal("User deleted.")
                this.getUserList();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renderUserList = () => {
        return this.state.userList.map((val, idx) => {
            const { username, fullName, password, email, role, id } = val;
            return (
                <>
                    <tr
                        onClick={() => {
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
                        }}
                    >
                        <td> {id} </td>
                        <td> {username} </td>
                    </tr>
                    <tr
                        className={`collapse-item ${
                            this.state.activeUsers.includes(idx) ? "active" : null
                            }`}
                    >
                        <td className="" colSpan={3}>
                            <div className="d-flex  align-items-center">
                                <div className="d-flex">
                                    <div className="d-flex flex-column ml-4 justify-content-center">
                                        <h5>{username}</h5>
                                        <h6 className="mt-2">
                                            Full Name:
                      <span style={{ fontWeight: "normal" }}> {fullName}</span>
                                        </h6>
                                        <h6>
                                            Email:
                      <span style={{ fontWeight: "normal" }}> {email}</span>
                                        </h6>
                                        <h6>
                                            Password:
                      <span style={{ fontWeight: "normal" }}> {password}</span>
                                        </h6>
                                        <h6>
                                            Role:
                      <span style={{ fontWeight: "normal" }}> {role}</span>
                                        </h6>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-center ml-5">
                                    <ButtonUI onClick={() => this.editMemberBtnHandler(idx)} type="contained">Edit</ButtonUI>
                                    <ButtonUI onClick={() => this.deleteMembers(val.id)} className="mt-3" type="textual">Delete</ButtonUI>
                                </div>
                            </div>
                        </td>
                    </tr>
                </>
            )
        })
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

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
                this.props.onCart(total);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.cartQuantityHandler()
        this.getUserList();
    }

    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>MEMBERS</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderUserList()}</tbody>
                    </table>
                </div>
                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit Member</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6">
                                <TextField
                                    value={this.state.editMember.fullName}
                                    placeholder="Full Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "fullName", "editMember")
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <TextField
                                    value={this.state.editMember.email}
                                    placeholder="Email"
                                    onChange={(e) => this.inputHandler(e, "email", "editMember")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <TextField
                                    value={this.state.editMember.password}
                                    placeholder="Password"
                                    onChange={(e) => this.inputHandler(e, "password", "editMember")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <select
                                    value={this.state.editMember.role}
                                    className="custon-text-input h-100 pl-3"
                                    onChange={(e) => this.inputHandler(e, "role", "editMember")}
                                >
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                </select>
                            </div>
                            <div className="col-5 mt-3 offset-1">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.toggleModal}
                                    type="outlined"
                                >
                                    Cancel
                                </ButtonUI>
                            </div>
                            <div className="col-5 mt-3">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.editMemberHandler}
                                    type="contained"
                                >
                                    Save
                                </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminMembers);