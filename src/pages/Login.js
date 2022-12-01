import React, {useEffect, useState} from 'react'
import { Grid, TextField, Button, Alert, IconButton, setOpen, Collapse } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {Link, useNavigate, useLocation} from "react-router-dom"
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"

const Login = () => {
    const auth = getAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = React.useState(false)
    const [open2, setOpen2] = React.useState(false)
    let [resetMsg, setResetMsg] = useState("")

    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [emailerror, setEmailerror] = useState("")
    let [passworderror, setPassworderror] = useState("")
    let [passwordlengtherror, setPasswordlengtherror] = useState("")
    let [showpassword, setShowpassword] = useState(false)
    let [wrongemailerror, setWrongemailerror] = useState("")
    let [wrongpassworderror, setWrongpassworderror] = useState("")

    useEffect(() => {
        if(location.state !== null){
            setResetMsg(location.state.msg)
            setOpen2(true)
        }
    }, [])

    let handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            navigate('/home')
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }
    let handleFbSignIn = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            // ...
            navigate('/home')
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);
            // ...
        });
    }

    let handleSubmit = () => {
        if(!email){
            setEmailerror("Please enter your email")
        }
        else if(!password){
            setPassworderror("Please enter your password")
            setEmailerror("")
        }
        else if(password.length < 8){
            setPasswordlengtherror("password should have contain minimum 8 character")
            setPassworderror("")
        }
        else{
            setPasswordlengtherror("")
            signInWithEmailAndPassword(auth, email, password).then((user) => {
                navigate('/home')
            }).catch((error) => {
                const errorCode = error.code
                if(errorCode.includes('user')){
                    setWrongemailerror("Email is not registered")
                    setOpen(true)
                    setWrongpassworderror("")
                }
               else if(errorCode.includes('password')){
                    setWrongemailerror("")
                    setWrongpassworderror("Wrong Password! Please enter correct password")
                    setOpen(true)
                }
            })
        }
    }

    let HandleClick = () => {
        setShowpassword(!showpassword)
    }


  return (
    <>
        <section className='login-part'>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <div className='box'>
                        <div className='left'>
                            <h2>Login to your account!</h2>

                            <Collapse in={open2}>
                                <Alert
                                    severity='success'
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpen2(false);
                                        }}
                                        >
                                        <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 , mt: 2}}
                                    >
                                    {resetMsg}
                                </Alert>
                            </Collapse>

                            <div className='loginOption'>
                                <div onClick={handleGoogleSignIn} className='option'>
                                    <img src="./assets/images/Google.png"/>
                                    <p>Login with Google</p>
                                </div>
                                <div onClick={handleFbSignIn} className='option'>
                                    <img src="./assets/images/Facebook.png"/>
                                    <p>Login with Facebook</p>
                                </div>
                            </div>
                            <Collapse in={open}>
                                <Alert
                                    severity='error'
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                        >
                                        <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                    >
                                    {wrongemailerror?wrongemailerror:wrongpassworderror&&wrongpassworderror}
                                </Alert>
                            </Collapse>
                            <TextField
                            helperText={emailerror}
                            id="demo-helper-text-misaligned"
                            label="Email Address"
                            style={{width: '368px', marginTop: '15px'}}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            /> <br/>
                            <div className='pass'>
                                <TextField
                                helperText={passworderror ? passworderror : passwordlengtherror ? passwordlengtherror : ""}
                                id="demo-helper-text-misaligned"
                                label="Password"
                                style={{width: '368px', marginTop: '15px'}}
                                type={showpassword? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                /> 
                                {showpassword
                                ? 
                                <AiOutlineEyeInvisible onClick={HandleClick} className='eye'/> 
                                : 
                                <AiOutlineEye onClick={HandleClick} className='eye'/>
                                }
                            </div>
                            <Button onClick={handleSubmit} style={{width: '425px', padding: '20px 0px', marginTop: '45px', borderRadius: '8px', background: '#5F34F5'}} variant="contained">Login to Continue</Button>
                            <p className='link'>Don’t have an account? <Link to='/'>Sign up</Link></p>
                            <p className='link'>Forgot Password? <Link to='/reset'>Click Here</Link></p>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <img style={{width: '100%', height: '100vh'}} src="./assets/images/loginbg.png"/>
                </Grid>
            </Grid>
        </section>
    </>
  )
}

export default Login