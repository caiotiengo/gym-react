import * as React from 'react'
import {Navigate} from "react-router-dom";
import {useContext, useState} from "react";
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

    console.log(authed)

    if (authed) return children

    return <Navigate to="/login" replace/>
}