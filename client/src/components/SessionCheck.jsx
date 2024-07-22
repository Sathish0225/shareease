import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionCheck = (WrappedComponent) => {
    const ComponentWithSessionCheck = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const loggedInUser = sessionStorage.getItem("user");
            if (!loggedInUser) {
                navigate("/");
            }
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };

    return ComponentWithSessionCheck;
};

export default SessionCheck;