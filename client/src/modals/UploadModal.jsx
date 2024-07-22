import React, { useRef, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import FileService from '../api/FileService';
import { toast } from 'react-toastify';

const UploadModal = ({ show, openModal, fetchFiles }) => {
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const [file, setFile] = useState(null);

    const handleFiles = (selectedFile) => {
        setFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZoneRef.current.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZoneRef.current.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZoneRef.current.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            fileInputRef.current.files = e.dataTransfer.files;
            e.dataTransfer.clearData();
        }
    };

    const handleChange = (e) => {
        handleFiles(e.target.files[0]);
    };

    const uploadFile = async () => {
        if (file.length === 0) {
            toast.error('You have to choose a file first!');
            return;
        }
        try {
            await FileService.uploadFile(file);
            openModal(false);
            fetchFiles();
            setFile(null);
            toast.success('File uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload file. Please try again.');
        }
    }

    return (
        <Modal show={show} onHide={() => openModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Upload Files</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6 className='fw-normal'>Click to select files from your computer or drag and drop to the area below</h6>
                <input
                    type="file"
                    className="d-none"
                    name="inputFile"
                    ref={fileInputRef}
                    onChange={handleChange}
                />
                <div
                    className="upload-drop-zone"
                    id="drop-zone"
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <label className="form-label">{file ? `You have chosen ${file.name}` : "Just drag and drop files here"}</label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className='btn-sm rounded-2' onClick={() => openModal(false)}>Close</Button>
                <Button variant="primary" className='btn-sm rounded-2' onClick={uploadFile} disabled={file === null}>Upload File</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UploadModal;
