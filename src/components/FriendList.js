import React, { useEffect, useState } from 'react'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {IoMdChatboxes} from 'react-icons/io'
import { getDatabase, ref, onValue} from "firebase/database";
import { getAuth } from "firebase/auth";
import { Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { activeChat } from '../slice/activeChatSlice';

const FriendList = (props) => {
    const dispatch = useDispatch()

    const db = getDatabase();
    const auth = getAuth();

    const [friends, setFriends] = useState([])

    useEffect(()=>{

        let friendsArray = []

        const friendsRef = ref(db, 'friends');
        onValue(friendsRef, (snapshot) => {
        // const data = snapshot.val();
        snapshot.forEach(item=>{
            if(auth.currentUser.uid == item.val().senderid || auth.currentUser.uid == item.val().receiverid){
                friendsArray.push(item.val())
            }
        })
            setFriends(friendsArray)
        })
    },[])

    let handleActiveChat = (item) => {
        let userInfo = {}
        if(item.receiverid == auth.currentUser.uid){
            userInfo.status= 'single'
            userInfo.id = item.senderid
            userInfo.name = item.sendername
        }else{
            userInfo.status= 'single'
            userInfo.id = item.receiverid
            userInfo.name = item.receivername
        }
        dispatch(activeChat(userInfo));
    };

  return (
    <div className={props.height ==  'chat-friendList'? 'grouplist frndlist chatFriendList' : 'grouplist frndlist'}>
        <h2>{friends.length} {friends.length > 1 ? 'Friends' : 'Friend'}</h2>
        <div className='dots'>
            <BsThreeDotsVertical/>
        </div>

        {friends.length == 0 && <Alert severity="info">You have no friend</Alert>}
        {friends.map((item)=>(
            <div className='box' onClick={() => handleActiveChat(item)}>
            <div className='img'>
                <img src='assets/images/frndlist.png' alt='group-img'/>
            </div>
            <div className='name'>
                {auth.currentUser.uid == item.senderid
                ?
                <h3>{item.receivername}</h3>
                :
                <h3>{item.sendername}</h3>
                }
                <h4>Hi Guys, Wassup!</h4>
            </div>
            <div className='btn'>
                {props.item=="date"
                ?
                <p>{item.date}</p>
                :
                <button><IoMdChatboxes/></button>
                }
            </div>
        </div>
        ))}

    </div>
  )
}

export default FriendList