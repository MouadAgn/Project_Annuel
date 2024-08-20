import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@services/Security";

const Logout = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    }, []);

    return null;
}

export default Logout;