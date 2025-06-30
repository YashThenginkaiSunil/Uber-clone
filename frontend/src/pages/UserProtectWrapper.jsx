import React, { useContext, useEffect } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

// children is the protected Component
const UserProtectWrapper = ({ children }) => 
{
    //1.fetch token from localStorage
    //2.if token not present , redirect to loginpage else go to Protected page

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    console.log(token)

    useEffect(() => 
        {
        if (!token) // if token not present navigate to Login page
            {
            navigate('/login')
            }
        }, [ token ])

    return (
        <>
            {children} 
        </>
    )
}

export default UserProtectWrapper