import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import * as fileCheck from 'valid-filename';
import FileService from '../api/FileService';
import { toast } from 'react-toastify';

const Editable = ({ file, fetchFiles }) => {
    const [editable, setEditable] = useState(false);
    const [rename, setRename] = useState("");

    useEffect(() => {
        setRename(file.name);
        // eslint-disable-next-line
    }, []);

    const handleEdit = () => {
        setEditable(true);
    }

    const handleChange = (e) => {
        setRename(e.target.value);
    };

    const handleSubmit = (file) => {
        if (fileCheck(rename)) {
            FileService.updateFile(file._id, rename).then(() => {
                toast.success(`File name updated successfully from ${file.name} to ${rename}`);
                fetchFiles();
            }).catch((err) => {
                toast.error("Oops! Something went wrong");
            });
            setEditable(false);
        } else {
            toast.error("Invalid file name");
        }
    }

    return (
        <td>
            {editable ? (
                <input className='form-control rounded-2'
                    type="text"
                    value={rename}
                    onChange={handleChange}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            handleSubmit(file);
                        }
                    }}
                />
            ) : (
                <OverlayTrigger placement={'bottom'} overlay={<Tooltip id="tooltip-bottom">Click to edit file name</Tooltip>}>
                    <span onClick={handleEdit} style={{ display: 'block' }}>
                        {file.name}
                    </span>
                </OverlayTrigger>
            )}
        </td>
    )
}

export default Editable;
