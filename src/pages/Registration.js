import React, {useState} from 'react'
import { Grid, TextField, Button, Alert, IconButton, setOpen, Collapse } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {Link, useNavigate} from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
    const auth = getAuth();
    const db = getDatabase();
    const [open, setOpen] = React.useState(false)
    let navigate = useNavigate();

    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [confirmpassword, setConfirmpassword] = useState("")

    let [nameerror, setNameerror] = useState("")
    let [emailerror, setEmailerror] = useState("")
    let [passworderror, setPassworderror] = useState("")
    let [confirmpassworderror, setConfirmpassworderror] = useState("")
    let [passwordlengtherror, setPasswordlengtherror] = useState("")
    let [passwordmatcherror, setPasswordmatcherror] = useState("")
    let [emailerrorexist, setEmailerrorexist] = useState("")

    let handleSubmit = () => {
        if(!name){
            setNameerror("Please enter your name")
        }
        else if(!email){
            setEmailerror("Please enter your email")
            setNameerror("")
        }
        else if(!password){
            setPassworderror("Please enter a password")
            setEmailerror("")
        }
        else if(password.length < 8){
            setPasswordlengtherror("Password should be contain minimum 8 character")
            setPassworderror("")
        }
        else if(!confirmpassword){
            setConfirmpassworderror("Please confirm your password")
            setPasswordlengtherror("")
        }
        else if(password !== confirmpassword){
            setPasswordmatcherror("Password doesn't match")
            setConfirmpassworderror("")
        }
        else{
            setPasswordmatcherror("")
            createUserWithEmailAndPassword(auth, email, password).then((user) => {
                navigate('/login')
                sendEmailVerification(auth.currentUser)
                .then(() => {
                    updateProfile(auth.currentUser, {
                        displayName: name,
                      }).then(() => {
                        console.log("name okay")
                        set(ref(db, 'users/'+auth.currentUser.uid), {
                            username: name,
                            email: email,
                          });
                      }).catch((error) => {
                        console.log(error)
                      });
                });
            }).catch((error) => {
                const errorCode = error.code;
                if(errorCode.includes('email')){
                    setEmailerrorexist('This Email is Already in Use. Please Try with Another Email')
                    setOpen(true)
                }
            })
        }
    }

  return (
    <section className='registration-part'>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <div className='box'>
                    <div className='left'>
                        <h2>Get started with easily register</h2>
                        <p style={{marginBottom: '20px'}}>Free register and you can enjoy it</p>
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
                                {emailerrorexist}
                            </Alert>
                        </Collapse>
                        <TextField
                            helperText={nameerror}
                            id="demo-helper-text-misaligned"
                            label="Full name"
                            style={{width: '368px', marginTop: '30px'}}
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        /> <br/>
                        <TextField
                            helperText={emailerror}
                            id="demo-helper-text-misaligned"
                            label="Email Address"
                            style={{width: '368px', marginTop: '30px'}}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        /> <br/>
                        <TextField
                            helperText={passworderror ? passworderror : passwordlengtherror ? passwordlengtherror : ""}
                            id="demo-helper-text-misaligned"
                            label="Password"
                            style={{width: '368px', marginTop: '30px'}}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        /><br/>
                        <TextField
                            helperText={confirmpassworderror ? confirmpassworderror : passwordmatcherror ? passwordmatcherror : ""}
                            id="demo-helper-text-misaligned"
                            label="Confirm Password"
                            style={{width: '368px', marginTop: '30px'}}
                            type="password"
                            onChange={(e) => setConfirmpassword(e.target.value)}
                        /> <br/>
                        <Button onClick={handleSubmit} style={{width: '368px', padding: '15px 0px', marginTop: '30px', borderRadius: '86px', background: '#5F35F5'}} variant="contained">Sign up</Button>
                        <p className='link'>Already have an account? <Link to='/login'>Login</Link></p>
                    </div>
                </div>
            </Grid>
            <Grid item xs={6}>
                <img style={{width: '100%', height: '100vh'}} src="./assets/images/registrationbg.png"/>
            </Grid>
        </Grid>
    </section>
  )
}

export default Registration