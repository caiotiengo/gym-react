import * as React from 'react'
import {Navigate} from "react-router-dom";
import {useContext} from "react";
import PropTypes from "prop-types";
import {AuthContext} from './AuthProvider'

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) throw new Error('AuthProvider not been used.')

    const {authed, login, logout} = context

    return {
        authed, login, logout
    };
}

export const RequireAuth = ({children}) => {
    const {authed} = useAuth()

    if (authed) return children

    return <Navigate to="/login" replace/>
}

RequireAuth.propTypes = {
    children: PropTypes.node.isRequired
}