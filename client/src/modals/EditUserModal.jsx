import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import UserService from '../api/UserService';
import { toast } from 'react-toastify';

const EditUserModal = ({ show, openModal, fetchUsers, user }) => {
  const [editUser, setEditUser] = useState({
    _id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    setEditUser(user);
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    UserService.edituser(editUser._id, editUser.name).then(() => {
      toast.success("User Info Updated successfully");
      openModal(false);
      fetchUsers();
    }).catch((err) => {
      toast.error(err.response.data.message);
    });
  }

  return (
    <Modal show={show} onHide={() => openModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
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
              value={editUser.name}
              onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" name="email" className="form-control rounded-2" placeholder=""
              autoComplete="off"
              value={editUser.email}
              readOnly
              onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-success btn-block rounded-2">
            Edit User
          </button>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default EditUserModal
