import React, { useState, useEffect } from 'react';

const UserHolder = ({ user, select, remove, display, shared }) => {
    const [toggle, setToggle] = useState(false);
    const handleSelect = (user) => {
        if (toggle) {
            remove(user);
        } else {
            select(user);
        }
        setToggle(!toggle);
    }

    useEffect(() => {
        setToggle(shared);
        // eslint-disable-next-line
    }, [])

    return (
        <div className='userHolder' style={{ display: "display" }}>
            <span>{user.email}</span>
            <button className={"btn btn-sm rounded-1" + (toggle ? " btn-secondary" : " btn-outline-secondary")}
                onClick={() => handleSelect(user)}>
                {toggle ? "Remove" : "Select"}
            </button>
        </div>
    )
}

export default UserHolder
