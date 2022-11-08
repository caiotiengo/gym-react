import * as React from "react";
import {createContext, useMemo, useState} from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import PropTypes from "prop-types";
import { app } from '../utils/firebase'

const auth = getAuth(app)

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [authed, setAuthed] = useState(false);


    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)

            setAuthed(true)
            return true
        } catch (e) {
            return {
                error: 'Houve um problema'
            }
        }
    }

    const logout = async () => {
        await signOut(auth)
        setAuthed(false);
    }

    const contextValue = useMemo(
        () => ({ authed, login, logout }),
        [authed]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}