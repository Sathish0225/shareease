import React, { useState } from 'react';
import { Modal } from "react-bootstrap";
import UserService from '../api/UserService';
import { toast } from 'react-toastify';

const AddUserModal = ({ show, openModal, fetchUsers }) => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    const handleClick = (e) => {
        e.preventDefault();
        UserService.addNewuser(user.name, user.email, user.password, user.confirmPassword).then(() => {
            toast.success("New User Added successfully");
            openModal(false);
            fetchUsers();
        }).catch((err) => {
            toast.error(err.response.data.message);
        });
    }
    return (
        <Modal show={show} onHide={() => openModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form
                    autoComplete="off"
                    acceptCharset="UTF-8"
                    onSubmit={handleClick}
                >
                    <div className="mb-2">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" name="name" className="form-control rounded-2" placeholder=""
                            autoComplete="off"
                            onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" className="form-control rounded-2" placeholder=""
                            autoComplete="off"
                            onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" name="password" className="form-control rounded-2" placeholder=""
                            autoComplete="off"
                            onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password" className="form-label">Confirm Password</label>
                        <input type="password" name="confirmPassword" className="form-control rounded-2" placeholder=""
                            autoComplete="off"
                            onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-success btn-block rounded-2">
                        Add User
                    </button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default AddUserModal
