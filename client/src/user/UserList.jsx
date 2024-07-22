import React, { useEffect, useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import moment from 'moment-timezone';
import * as hugIcons from "hugeicons-react";
import DataTable from 'react-data-table-component';
const timeZone = process.env.TIMEZONE || "Asia/Singapore";
moment.tz.setDefault(timeZone);

const UserList = ({ userList, fetchUsers, selectUser, deleteUser }) => {
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
            name: "Name",
            selector: row => row.name,
            sortable: true,
            width: "30%"
        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true,
            width: "30%"
        },
        {
            name: "Status",
            selector: row => (
                <>
                    <span className={`badge ${row.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>{row.status}</span>
                </>
            ),
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
            cell: row => (
                <div>
                    <button className='btn btn-sm btn-primary'
                        style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
                        onClick={() => selectUser(row)}>
                        <hugIcons.Edit02Icon size={14} />
                    </button>
                    <button className='btn btn-sm btn-danger'
                        style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}
                        onClick={() => deleteUser(row)}>
                        <hugIcons.Delete02Icon size={14} />
                    </button>
                </div>
            ),
            width: "11.8%"
        },
    ];

    const handleFilter = (e) => {
        const value = e.target.value || "";
        setFilter(value);
    }

    const filterData = data.filter((row) => {
        return Object.values(row).some((value) => value.toString().toLowerCase().includes(filter.toLowerCase()));
    });

    useEffect(() => {
        setData(userList);
    }, [userList]);

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
            columns={columns}
            data={filterData}
            showGridlines
            customStyles={customStyles}
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
            noDataComponent={<div className="text-center text-secondary p-3">No Data Found</div>}
        />
    )
}

export default UserList
