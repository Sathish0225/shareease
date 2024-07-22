import React from 'react';

const NotFound = () => {
    return (
        <div className="text-center d-flex flex-column justify-content-center align-items-center vh-100">
            <h2>Error 404!</h2>
            <p>The page you have requested is not found!</p>
            <p>Back to <a href="/home">Home</a></p>
        </div>
    )
}

export default NotFound
