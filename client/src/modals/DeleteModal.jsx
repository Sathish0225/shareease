import React from 'react'
import FileService from '../api/FileService';
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const DeleteModal = ({ show, openModal, fetchFiles, file }) => {

    const handleDelete = () => {
        FileService.deleteFile(file._id).then(() => {
            toast.success("File deleted successfully");
            openModal(false);
            fetchFiles();
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
                <p className="text-center">Are you sure you want to delete <i>{file.name}</i>?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' className='btn btn-sm rounded-1' onClick={() => openModal(false)}>Close</Button>
                <Button variant='danger' className='btn btn-sm rounded-1' onClick={() => handleDelete()}>Delete</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteModal
