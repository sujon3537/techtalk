import React, { useEffect, useState } from 'react'
import {BsThreeDotsVertical} from 'react-icons/bs'
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Alert } from '@mui/material';

const FriendRequest = () => {
    const db = getDatabase();
    const auth = getAuth();
    
    let [friendReq, setFriendReq] = useState([])
    let [dltFrRq, setDltFrRq] = useState(false)

    useEffect(() => {
        let friendReqarr = []
        const friendreqRef = ref(db, 'friendreq/');
        onValue(friendreqRef, (snapshot) => {
        snapshot.forEach((item) => {
            if(item.val().receiverid == auth.currentUser.uid){
                friendReqarr.push({
                    id: item.key,
                    sendername: item.val().sendername,
                    senderid: item.val().senderid,
                    receivername: item.val().receivername,
                    receiverid: item.val().receiverid,
                })
            }
            
        })
        setFriendReq(friendReqarr)
        });
    }, [dltFrRq])
    
    let handleAcceptFriend = (friend)=> {
        set(push(ref(db, 'friends')), {
            id: friend.id,
            sendername: friend.sendername,
            senderid: friend.senderid,
            receivername: friend.receivername,
            receiverid: friend.receiverid,
            date: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
          }).then(()=>{
            remove(ref(db, 'friendreq/' + friend.id)).then(()=>{
                setDltFrRq(!dltFrRq)
            })
          });
    }

  return (
    <div className='grouplist'>
        <h2>Friend  Request</h2>
        <div className='dots'>
            <BsThreeDotsVertical/>
        </div>
        {friendReq.map(item =>(
            <div className='box'>
                <div className='img'>
                    <img src='assets/images/frndreq.png' alt='frndreq-img'/>
                </div>
                <div className='name'>
                    <h3>{item.sendername}</h3>
                    <h4>Hi Guys, Wassup!</h4>
                </div>
                <div className='btn'>
                    <button onClick={()=>handleAcceptFriend(item)}>Accept</button>
                </div>
            </div>            
        ))}
        {friendReq.length == 0 && <Alert severity="info">No Friend Request</Alert>}
    </div>
  )
}

export default FriendRequest