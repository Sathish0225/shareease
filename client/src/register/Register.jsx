import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as hugIcons from "hugeicons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/login.css";
import AuthService from '../api/AuthService';

const Register = () => {
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = AuthService.isUserLoggedIn();
    if (loggedInUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    AuthService.register(register.name, register.email, register.password, register.confirmPassword).then(() => {
      toast.success("Registration successfully");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    }).catch((err) => {
      toast.error(err.response.data.message);
    });
  }

  return (
    <div className="container">
      <div className="content-center">
        <div className="login-content">
          <div className="box-info">
            <div className="justify-content-center align-items-center text-center">
              <Link to="/" className="d-flex flex-column align-items-center justify-content-center text-decoration-none text-dark fw-bold">
                <hugIcons.AiCloud02Icon size={36} />
                <span style={{ fontFamily: "Playwrite CU , cursive", fontSize: "20px" }} className="mx-2">ShareEase</span>
              </Link>
            </div>
            <h2 className="text-center fw-bold mt-3">Register
            </h2>
            <form
              autoComplete="off"
              acceptCharset="UTF-8"
              onSubmit={handleClick}
            >
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <hugIcons.AnonymousIcon size={16} />
                </span>
                <input
                  type="text"
                  className="form-control l-input"
                  name="name"
                  placeholder="Name"
                  autoComplete="off"
                  onChange={handleChange}
                />
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <hugIcons.Mail01Icon size={16} />
                </span>
                <input
                  type="email"
                  className="form-control l-input"
                  name="email"
                  placeholder="Email"
                  autoComplete="off"
                  onChange={handleChange}
                />
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <hugIcons.SquareLock02Icon size={16} />
                </span>
                <input
                  type="password"
                  className="form-control l-input"
                  name="password"
                  placeholder="Password"
                  autoComplete="off"
                  onChange={handleChange}
                />
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <hugIcons.SquareLockPasswordIcon size={16} />
                </span>
                <input
                  type="password"
                  className="form-control l-input"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  onChange={handleChange}
                />
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <button type="submit" className="btn btn-success btn-block">
                    Register Now
                  </button>
                </div>
              </div>
            </form>
            <div className='text-center m-2 text-decoration-underline'>Are you a Member? <a href={"/login"} className='text-decoration-none text-dark fw-bold'>SignIn</a></div>
            <div className="content-footer text-center mt-2">
              <a
                href="/"
                className="content-footer-link"
                target="_blank"
                rel="noopener noreferrer"
                data-toggle="tooltip"
                title=""
                data-original-title="Sathishkumar Ranganathan"
              >
                <b>ShareEase System V1.0.0</b>
              </a>
              <br />
              <span className="content-footer-copyright-text">
                &copy; {new Date().getFullYear()} Designed by Sathishkumar. ALL RIGHTS RESERVED.
              </span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer component */}
    </div>
  )
}

export default Register
