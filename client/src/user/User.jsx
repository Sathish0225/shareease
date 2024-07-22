import React, { useState, useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as hugIcons from "hugeicons-react";
import UserList from './UserList';
import UserService from '../api/UserService';
import Loading from '../modals/Loading';
import AddUserModal from '../modals/AddUserModal';
import EditUserModal from '../modals/EditUserModal';
import DeleteUserModal from '../modals/DeleteUserModal';

const User = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [userToDelete, setUserToDelete] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

    const openAddUserModal = (option) => {
        setShowAddUserModal(option);
    };
    const openEditUserModal = (option) => {
        setShowEditUserModal(option);
    };
    const openDeleteUserModal = (option) => {
        setShowDeleteUserModal(option);
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        setShowEditUserModal(true);
        openEditUserModal(true);
    }

    const deleteUser = (user) => {
        setUserToDelete(user);
        setShowDeleteUserModal(true);
        openDeleteUserModal(true);
    }

    const fetchUsers = async () => {
        await UserService.getAllUser().then((res) => {
            setUsers(res.data.data);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="content-body">
            {loading && <Loading />}
            <ToastContainer />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span><strong>List</strong> Users</span>
                    <div>
                        <button className='btn btn-sm btn-primary rounded-1 d-flex align-items-center justify-content-between'
                            onClick={() => { openAddUserModal(true) }}>
                            <hugIcons.Add01Icon size={14} style={{ marginRight: "5px" }} />
                            <span style={{ fontSize: "12px" }}>Add New</span>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <UserList userList={users} fetchUsers={fetchUsers} selectUser={selectUser} deleteUser={deleteUser} />
                </div>
            </div>
            {showAddUserModal && <AddUserModal show={showAddUserModal} openModal={openAddUserModal} fetchUsers={fetchUsers} />}
            {showEditUserModal && <EditUserModal show={showEditUserModal} openModal={openEditUserModal} fetchUsers={fetchUsers} user={selectedUser} />}
            {showDeleteUserModal && <DeleteUserModal show={showDeleteUserModal} openModal={openDeleteUserModal} fetchUsers={fetchUsers} user={userToDelete} />}
        </div>
    );
};

export default User;
