import * as React from "react";
import {createContext, useMemo, useState} from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [authed, setAuthed] = useState(false);


    const login = () => {
        return new Promise((res) => {
            setAuthed(true);
            res();
        });
    }

    const logout = () => {
        return new Promise((res) => {
            setAuthed(false);
            res();
        });
    }

    const contextValue = useMemo(
        () => ({ authed, login, logout }),
        [authed]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
