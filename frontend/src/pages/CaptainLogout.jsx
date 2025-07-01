import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const CaptainLogout = () => 
{
    const token = localStorage.getItem('captain-token')
    const navigate = useNavigate()

    const headersAuthorization={ headers: { Authorization: `Bearer ${token}` } }

    axios.get(`${import.meta.env.VITE_API_URL}/captains/logout`, headersAuthorization)
        .then((response) => {
            if (response.status === 200) 
            {
                localStorage.removeItem('captain-token')
                navigate('/captain-login')
            }
        })

    return (
        <div>CaptainLogout</div>
    )
}

export default CaptainLogout