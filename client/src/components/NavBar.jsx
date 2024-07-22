import React, { useState, useEffect } from "react";
import * as hugIcons from "hugeicons-react";
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../api/AuthService';

const NavBar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInUser = AuthService.isUserLoggedIn();
        if (loggedInUser) {
            setUser(JSON.parse(AuthService.currentUser()));
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        AuthService.logout();
        setLoggedIn(false);
        navigate("/");
        toast.success("Logged out successfully");
    };

    return (
        <>
            <nav className="navbar navbar-expand-md navbar-light shadow-sm p-3 bg-white">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand d-flex flex-row align-items-center mx-3">
                        <hugIcons.AiCloud02Icon size={28} />
                        <span style={{ fontFamily: "Playwrite CU, cursive", fontSize: "18px" }} className="mx-1">ShareEase</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleMenu"
                        aria-controls="navbarToggleMenu" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarToggleMenu">
                        {
                            isLoggedIn && user ? (
                                <>
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
                                        <li className="nav-item">
                                            <Link to="/home" className="nav-link text-dark fw-bold p-2 mx-2 font-medium hover">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/user" className="nav-link text-dark fw-bold p-2 mx-2 font-medium hover">Users</Link>
                                        </li>
                                    </ul>
                                    <ul className="navbar-nav align-items-center">
                                        <li className="nav-item dropdown">
                                            <Link className="nav-link d-flex align-items-center" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Welcome, &nbsp;
                                                <span className="fw-bold">
                                                    {user.name}
                                                </span> &nbsp;
                                                <hugIcons.UserSharingIcon size={20} />
                                            </Link>
                                            <ul className="dropdown-menu">
                                                <li><Link className="dropdown-item" >Change Password</Link></li>
                                                <li><Link className="dropdown-item" onClick={handleLogout}>Logout</Link></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center"></ul>
                                    <ul className="navbar-nav align-items-center">
                                        <li className="nav-item">
                                            <Link to="/login" className="nav-link text-dark fw-bold p-2 mx-2 font-medium hover">Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/register" className="nav-link text-dark fw-bold p-2 mx-2 font-medium hover">Register</Link>
                                        </li>
                                    </ul>
                                </>
                            )
                        }
                    </div>
                </div>
            </nav>
            <ToastContainer />
        </>
    )
}

export default NavBar
