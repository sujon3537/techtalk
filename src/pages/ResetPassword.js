import React, { useState } from 'react'
import {RiLock2Line} from 'react-icons/ri'
import {TextField, Button} from '@mui/material';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {useNavigate} from "react-router-dom"

const ResetPassword = () => {
    const auth = getAuth();
    const navigate = useNavigate()

    let [email, setEmail] = useState("")

    let handleResetPassword = () => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            navigate('/login', {state: {msg: "Please, check your email for password reset"}})
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });
    }

  return (
    <div className='resetPass-part'>
        <div className='box'>
            <RiLock2Line className='icon'/>
            <h2>Reset Password</h2>
            <p>Please, Enter your email here to reset your password</p>
            <TextField className='input' onChange={(e)=>setEmail(e.target.value)} id="outlined-basic" label="Enter Email" variant="outlined" />
            <Button onClick={handleResetPassword} style={{width: '100%', padding: '18px 0px', borderRadius: '8px', background: '#5F34F5'}} variant="contained">Reset Password</Button>
        </div>
    </div>
  )
}

export default ResetPassword