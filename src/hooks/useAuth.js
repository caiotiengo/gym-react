import * as React from 'react'
import {Navigate} from "react-router-dom";
import {useContext} from "react";
import PropTypes from "prop-types";
import {AuthContext} from './AuthProvider'

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) throw new Error('AuthProvider not been used.')

    return {
        ...context
    };
}

export const RequireAuth = ({children}) => {
    const {user} = useAuth()
   
    if (user.email) return children
    
    return <Navigate to="/login" replace/>
}

RequireAuth.propTypes = {
    children: PropTypes.node.isRequired
}