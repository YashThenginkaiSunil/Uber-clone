import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const UserLogout = () => 
{
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    
//headers: { Authorization: 'Bearer ${token}' }: Sends the JWT token in the Authorization header so the backend knows which user is logging out.
//The token (Bearer ${token}) tells your server who’s making the request, so it can:
// ->Invalidate the token (e.g. add it to a blacklist)
// ->Clear cookies (if using cookie-based auth)
// ->Perform any cleanup needed
    const headersAuthorization={ headers: { Authorization: `Bearer ${token}` } }

    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, headersAuthorization)
        .then((response) => 
            {
                if (response.status === 200) 
                {
                    localStorage.removeItem('token')
                    navigate('/login')
                }
    })

    return (
        <div>UserLogout</div>
    )
}

export default UserLogout