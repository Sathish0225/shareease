import React, { useState, useEffect } from 'react';
import UploadModal from '../modals/UploadModal';
import ShareModal from '../modals/ShareModal';
import DeleteModal from '../modals/DeleteModal';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as hugIcons from "hugeicons-react";
import MyFiles from './MyFiles';
import SharedFiles from './SharedFiles';
import FileService from '../api/FileService';
import Loading from '../modals/Loading';
import { API_URL } from '../api/constants';
import * as io from 'socket.io-client';

const Home = () => {
    const [files, setFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [totalFiles, setTotalFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState({});
    const [fileToDelete, setFileToDelete] = useState({});
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    let connectionOptions = {
        "force new connection": true,
        "reconnectionAttempts": "Infinity",
        "timeout": 10000,
        "transports": ["websocket"]
    };
    const socket = io(API_URL, connectionOptions);

    const handleSocket = () => {
        socket.on("subscribe", file => {
            socket.emit("subscribe", file);
            fetchFiles();
        });
        socket.on("unsubscribe", file => {
            socket.emit("unsubscribe", file);
            fetchFiles();
        });
        socket.on("update", () => {
            fetchFiles();
        });
    }

    const openUploadModal = (option) => {
        setShowUploadModal(option);
    };
    const openShareModal = (option) => {
        setShowShareModal(option);
    };
    const openDeleteModal = (option) => {
        setShowDeleteModal(option);
    };

    const selectFile = (file) => {
        setSelectedFile(file);
        setShowShareModal(true);
        openShareModal(true);
    }

    const deleteFile = (file) => {
        setFileToDelete(file);
        setShowDeleteModal(true);
        openDeleteModal(true);
    }

    const fetchFiles = async () => {
        await FileService.retrieveFiles().then((res) => {
            setFiles(res.data.data.myFiles);
            setSharedFiles(res.data.data.sharedWithMe);
            setTotalFiles(res.data.data.total);
            totalFiles.forEach(file => {
                socket.emit("subscribe", file);
            });
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
        })
    }

    useEffect(() => {
        handleSocket();
        fetchFiles();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="content-body">
            {loading && <Loading />}
            <ToastContainer />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span><strong>My</strong> Files</span>
                    <div>
                        <button className='btn btn-sm btn-primary rounded-1 d-flex align-items-center justify-content-between'
                            onClick={() => { openUploadModal(true) }}>
                            <hugIcons.Upload02Icon size={14} style={{ marginRight: "5px" }} />
                            <span style={{ fontSize: "12px" }}>Upload File</span>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <MyFiles fileList={files} fetchFiles={fetchFiles} selectFile={selectFile} deleteFile={deleteFile} />
                </div>
            </div>
            <div className="card mt-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span><strong>Shared</strong> With Me</span>
                    <div></div>
                </div>
                <div className="card-body">
                    <SharedFiles fileList={sharedFiles} fetchFiles={fetchFiles} socket={socket} />
                </div>
            </div>
            {showUploadModal && <UploadModal show={showUploadModal} openModal={openUploadModal} fetchFiles={fetchFiles} />}
            {showShareModal && <ShareModal show={showShareModal} openModal={openShareModal} fetchFiles={fetchFiles} file={selectedFile} />}
            {showDeleteModal && <DeleteModal show={showDeleteModal} openModal={openDeleteModal} fetchFiles={fetchFiles} file={fileToDelete} />}
        </div>
    );
};

export default Home;
