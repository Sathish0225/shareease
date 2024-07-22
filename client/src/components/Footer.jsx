import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className='bg-white'>
            <div className="footer-bottom">
                <div className="container">
                    <div className="section-wrapper">
                        <p>&copy; 2024<Link to="/">ShareEase System</Link>Designed by<a href="/" target='_blank'>Ranganathan Sathishkumar</a></p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
