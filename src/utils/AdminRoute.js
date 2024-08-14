import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// import { MessageBox } from "../components";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../Redux/Slices/AuthSlice";

export default function AdminProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const { userInfo, token } = useSelector(state => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        const checkToken = async () => {
            if (jwtDecode(token)?.exp < Date.now() / 1000) {
                // ctxDispatch({ type: "USER_SIGNOUT" });
                dispatch(logOut());
                localStorage.removeItem("userInfo");
                localStorage.removeItem("token");

                navigate("/");
            }
        };
        if (token)
            checkToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return userInfo && token ? (
        userInfo?.role === "admin" ? (
            children
        ) : (
            <div variant={"danger"}>Restricted</div>
        )
    ) : (
        <Navigate to="/register" />
    );
}


//done