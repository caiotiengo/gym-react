import * as React from "react";
import {createContext, useEffect, useMemo, useState} from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import PropTypes from "prop-types";
import { app } from '../utils/firebase'
import {getUserInLocalStorage, setUserInLocalStorege} from "../utils/authLocalStorage";

const auth = getAuth(app)

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    
    useEffect(() => {
        const currentUser = getUserInLocalStorage()
        
        if(currentUser) setUser(currentUser)
    }, [])
    
    const login = async (email, password) => {
        let currentUser = {};
        
        try {
            const userInLocalStorage = getUserInLocalStorage()
            
            if(userInLocalStorage) {
                currentUser = userInLocalStorage
            }
            
            const { user } = await signInWithEmailAndPassword(auth, email, password)
    
            currentUser = { name: user?.displayName, email: user?.email, image: user?.photoURL }
            
            setUserInLocalStorege(currentUser)
            setUser(currentUser)
            return true
        } catch (e) {
            return {
                error: 'Houve um problema'
            }
        }
    }

    const logout = async () => {
        await signOut(auth)
        setUserInLocalStorege({})
        setUser({});
    }

    const contextValue = useMemo(
        () => ({ user, login, logout }),
        [user]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}