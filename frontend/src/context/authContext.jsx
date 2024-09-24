import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || null));

    const login = async (inputs) => {
        try {
            const res = await axios.post("http://localhost:4500/api/auth/login", inputs);
            
            // Extract user data and token from response
            const { token, ...userData } = res.data;

            // Store token in localStorage
            localStorage.setItem("access_token", token);

            // Store user data in state and localStorage
            setCurrentUser(userData);
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:4500/api/auth/logout");

            // Remove user and token from localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");

            setCurrentUser(null);
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("user");
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
