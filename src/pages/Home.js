import React, { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {Alert, Grid} from '@mui/material'
import {useNavigate} from "react-router-dom"
import Leftbar from '../components/Leftbar'
import Search from '../components/Search'
import GroupList from '../components/GroupList'
import FriendRequest from '../components/FriendRequest'
import FriendList from '../components/FriendList'
import UserList from '../components/UserList'
import BlockedUsers from '../components/BlockedUsers'
import MyGroups from '../components/MyGroups'

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate()
  let [emailverify, setEmailverify] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmailverify(user.emailVerified)
        const uid = user.uid;
      } else {
        navigate('/login')
      }
    });
  }, [])

  return (
    <>
      {emailverify
      ?
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Leftbar active="home"/>
        </Grid>
        <Grid item xs={4}>
          <Search/>
          <GroupList/>
          <FriendRequest/>
        </Grid>
        <Grid item xs={3}>
          <FriendList item="date"/>
          <MyGroups/>
        </Grid>
        <Grid item xs={3}>
          <UserList/>
          <BlockedUsers/>
        </Grid>
      </Grid>
      :
      <Grid container spacing={2}>
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={4}>
          <Alert variant="filled" severity="info">Please, check your mail inbox for email verification</Alert>
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </Grid>
      }
    </>
  )
}

export default Home