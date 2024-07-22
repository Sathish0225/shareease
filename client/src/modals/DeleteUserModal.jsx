import React from 'react'
import UserService from '../api/UserService';
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const DeleteUserModal = ({ show, openModal, fetchUsers, user }) => {

  const handleDelete = () => {
    UserService.deleteUser(user._id).then(() => {
      toast.success("User deleted successfully");
      openModal(false);
      fetchUsers();
    }).catch((err) => {
      toast.error("Oops! Something went wrong");
      openModal(false);
    });
  };
  return (
    <Modal show={show} onHide={() => openModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="text-center">Delete a file can cause permanently removed</h6>
        <p className="text-center">Are you sure you want to delete <i>{user._id}</i>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' className='btn btn-sm rounded-1' onClick={() => openModal(false)}>Close</Button>
        <Button variant='danger' className='btn btn-sm rounded-1' onClick={() => handleDelete()}>Delete</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteUserModal
