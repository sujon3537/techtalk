import React, { useState, useEffect } from 'react'
import Registration from './pages/Registration'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Chat from './pages/Chat'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Home from './pages/Home';
import {MdDarkMode} from 'react-icons/md'
import {BsSunFill} from 'react-icons/bs'
function App() {
  const auth = getAuth()

  let [dark, setDark] = useState(false)
  let [dlmodeshow, setDlmodeShow] = useState(false)

  let handleDarkLight = () => {
    setDark(!dark)
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setDlmodeShow(true)
      } else {
        setDlmodeShow(false)
        setDark(false)
      }
    });
  },[])

  return (
  <>
    <div className={dark? "darkmode":"lightmode"}>
      {dlmodeshow &&
        <div className='dlMode' onClick={handleDarkLight}>
        {dark?
          <>
          <span className='light'><BsSunFill/></span>
          <span className='modeText'>Switch to Lightmode</span>
          </>
          :
          <>
          <span className='dark'><MdDarkMode/></span>
          <span className='modeText'>Switch to Darkmode</span>
          </>
        }
      </div>
      }
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Registration/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/reset" element={<ResetPassword/>}></Route>
            <Route path="/chat" element={<Chat/>}></Route>
          </Routes>
        </BrowserRouter>
    </div>
  </>
  );
}

export default App;