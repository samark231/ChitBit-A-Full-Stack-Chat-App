import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage'
import LogInPage from './pages/LogInPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import useAuthStore from './store/useAuthStore.js'
import useThemeStore from './store/useThemeStore.js';
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div className='App' data-theme={theme}>
      <NavBar/>
      <Routes>
        <Route path='/' element={authUser? <HomePage/>: <Navigate to="/login"/>} />
        <Route path='/signup' element={!authUser? <SignUpPage/>: <Navigate to="/"/>} />
        <Route path='/login' element={!authUser? <LogInPage/>:<Navigate to="/"/>} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to='/login'/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
