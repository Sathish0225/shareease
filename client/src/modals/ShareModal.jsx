import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import FileService from '../api/FileService';
import UserService from '../api/UserService';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import UserHolder from './UserHolder';

const ShareModal = ({ show, openModal, fetchFiles, file }) => {

    const [filter, setFilter] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [wasSharing, setWasSharing] = useState(false);

    const fetchUsers = () => {
        UserService.getAllEmail().then((res) => {
            setUsers(res.data.data);
        }).catch((err) => {
            console.error(err);
        });
    }

    const retrieveSharedUsers = () => {
        FileService.retrieveSharedUser(file._id).then((res) => {
            setSelectedUser(res.data.data);
            setWasSharing((res.data.data.length > 0) ? true : false);
        }).catch((err) => {
            console.error(err);
        });
    }

    const handleSelect = (user) => {
        setSelectedUser([...selectedUser, user._id]);
    }

    const handleRemove = (user) => {
        setSelectedUser(selectedUser.filter(item => item !== user._id));
    }

    const handleFilter = (e) => {
        setFilter(e.target.value);
    }

    const handleShare = () => {
        FileService.shareFile(file._id, selectedUser).then((res) => {
            toast.success(`You have shared your file with ${selectedUser.length} people`);
            openModal(false);
            fetchFiles();
        }).catch((err) => {
            console.error(err);
        });
    }

    const sortFunc = (a, b) => {
        let indexA = selectedUser.indexOf(a._id);
        let indexB = selectedUser.indexOf(b._id);

        if (indexA > indexB) return 1;
        if (indexA < indexB) return -1;
        return 0;
    }

    useEffect(() => {
        fetchUsers();
        retrieveSharedUsers();
        // eslint-disable-next-line
    }, [])

    return (
        <Modal show={show} onHide={() => openModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Share Files</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6 style={{ fontWeight: "normal" }}>Type in the user's email you want to share with</h6>
                <input type="text" className="form-control" placeholder="Recipient's username"
                    aria-label="Recipient's email" aria-describedby="basic-addon2"
                    onChange={handleFilter} />
                <div className="listUser">
                    {users.length > 0 && users.sort(sortFunc).map((user, i) => {
                        const check = (user.email.indexOf(filter) !== -1) ? "" : "none";
                        const checkShare = selectedUser.includes(user._id);
                        return (
                            <UserHolder user={user} key={user._id}
                                select={handleSelect} remove={handleRemove}
                                display={check} shared={checkShare} />
                        )
                    })}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className='btn-sm rounded-2' onClick={() => openModal(false)}>Close</Button>
                <Button variant={(selectedUser.length === 0 && wasSharing) ? "danger" : "primary"}
                    className='btn-sm rounded-2' onClick={handleShare}
                    disabled={(selectedUser.length > 0 || wasSharing) ? "" : "disabled"}>
                    {selectedUser.length === 0 && wasSharing ? "Don't Share" : "Share"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ShareModal
