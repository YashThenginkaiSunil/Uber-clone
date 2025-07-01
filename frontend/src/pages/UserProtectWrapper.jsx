import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// children is the protected Component
const UserProtectWrapper = ({ children }) => 
{
    //1.fetch token from localStorage
    //2.if token not present , redirect to loginpage else go to Protected page

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const { user, setUser } = useContext(UserDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    // console.log(`UserProtectWrapper ${token}`)

    useEffect(() => 
        {
            if (!token) // if token not present navigate to Login page
            {
                navigate('/login')
            }

            const headersAuthorization={ headers: { authorization: `Bearer ${token}` } }

            axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, headersAuthorization)
                .then( (response) => {
                        if (response.status === 200) 
                        {
                            console.log(response.data);
                            setUser(response.data.user)// sets user data in UserDataContext *WRONG*
                            console.log(user);// response.data.user doesnt exist, so no setting
                            setIsLoading(false)
                        }
                })
                .catch( (err) => {
                            console.log(err)
                            localStorage.removeItem('token')
                            navigate('/login')
                })
        }, [ token ])

        if (isLoading) 
        {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children} 
        </>
    )
}

export default UserProtectWrapper