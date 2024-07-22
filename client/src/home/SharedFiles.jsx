import React, { useEffect, useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import moment from 'moment-timezone';
import * as hugIcons from "hugeicons-react";
import FileService from "../api/FileService";
import DownloadService from "../api/DownloadService";
import { toast } from "react-toastify";
import * as FileDownload from 'js-file-download';
import DataTable from 'react-data-table-component';
const timeZone = process.env.TIMEZONE || "Asia/Singapore";
moment.tz.setDefault(timeZone);

const SharedFiles = ({ fileList, fetchFiles, socket }) => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("");

    const columns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "5%",
        },
        {
            name: "File Name",
            selector: row => row.name,
            sortable: true,
            width: "30%"
        },
        {
            name: "Owner",
            selector: row => row.ownerEmail,
            sortable: true,
            width: "30%"
        },
        {
            name: "Size (KB)",
            selector: row => Math.round(row.size * 100) / 100000 + " (KB)",
            sortable: false,
            width: "10%"
        },
        {
            name: "Modified",
            selector: row => {
                const updatedAt = moment(row.updatedAt);
                const now = moment();
                const diffMinutes = now.diff(updatedAt, 'minutes');
                const diffHours = now.diff(updatedAt, 'hours');
                if (diffMinutes < 60) {
                    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
                } else {
                    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                }
            },
            sortable: false,
            width: "10%"
        },
        {
            name: "Actions",
            selector: row => (
                <div>
                    <button className='btn btn-sm btn-secondary'
                        style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
                        onClick={() => handleDownload(row)}>
                        <hugIcons.Download04Icon size={14} />
                    </button>
                    <button className='btn btn-sm btn-danger'
                        onClick={() => handleUnshare(row)}
                        style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}>
                        <hugIcons.Share01Icon size={14} style={{ transform: "scaleX(-1)", }} />
                    </button>
                </div>
            ),
            width: "11.8%"
        },
    ];

    useEffect(() => {
        setData(fileList);
    }, [fileList]);

    const handleDownload = (file) => {
        DownloadService.downloadFile(file.download).then((result) => {
            FileDownload(result.data, file.name);
            toast.success(`Downloading ${file.name}`)
        }).catch((err) => { toast.error("Oops! Something went wrong"); });
    };

    const handleUnshare = (file) => {
        FileService.unShareFile(file._id).then(() => {
            socket.emit("unsubscribe", file._id);
            toast.success(`You have unshared ${file.name} with ${file.ownerEmail}.`);
        }).catch((err) => {
            toast.error("Oops! Something went wrong, we can't unshare this file.");
        });
        fetchFiles();
    }

    const handleFilter = (e) => {
        const value = e.target.value || "";
        setFilter(value);
    }

    const filterData = data.filter((row) => {
        return Object.values(row).some((value) => value.toString().toLowerCase().includes(filter.toLowerCase()));
    });

    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
                border: '1px solid #ddd',
            },
        },
        rows: {
            style: {
                border: '1px solid #ddd',
            },
        },
        cells: {
            style: {
                borderRight: '1px solid #ddd',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            },
        },
    };

    return (
        <DataTable
            showGridlines
            customStyles={customStyles}
            columns={columns}
            data={filterData}
            highlightOnHover
            fixedHeader
            persistTableHead={true}
            selectableRows
            pagination
            responsive
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
            subHeader
            subHeaderComponent={
                <input
                    type="text"
                    placeholder="Search here..."
                    className="w-25 form-control rounded-2"
                    value={filter}
                    onChange={handleFilter}
                />
            }
            noDataComponent={<div className="text-center text-secondary p-3">No Data Found</div>} />
    )
}

export default SharedFiles
