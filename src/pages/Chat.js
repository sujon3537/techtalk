import React from 'react'
import {Grid} from '@mui/material'
import Leftbar from '../components/Leftbar'
import Search from '../components/Search'
import JoinedGroupList from '../components/JoinedGroupList'
import FriendList from '../components/FriendList'
import Chatting from '../components/Chatting'

const Chat = () => {
  return (
    <div className='chat-part'>
        <Grid container spacing={2}>
        <Grid item xs={2}>
          <Leftbar active="chat"/>
        </Grid>
        <Grid item xs={4}>
          <Search/>
          <JoinedGroupList/>
          <FriendList item="button" height="chat-friendList"/>
        </Grid>
        <Grid item xs={6}>
          <Chatting/>
        </Grid>
        </Grid>
    </div>
  )
}

export default Chat