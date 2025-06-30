import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<Captainlogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />

 {/* home is a protected route, before going to Home page, first go to UserProtectWrapper (Higher Order Component), check if user is logged in or not, If yes go to Home page else go to login page */}

        <Route path='/home' element={

              <UserProtectWrapper>
                  <Home />
              </UserProtectWrapper>
          } />
        <Route path='/user/logout' element={
              <UserProtectWrapper>
                  <UserLogout />
              </UserProtectWrapper>
          } />

      </Routes>
    </div>
  )
}

export default App