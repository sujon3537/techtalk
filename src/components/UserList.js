import React, { useEffect, useState } from 'react'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {FaUserFriends} from 'react-icons/fa'
import { getDatabase, set, ref, onValue, push} from "firebase/database";
import { getAuth } from "firebase/auth";

const UserList = () => {
    const db = getDatabase();
    const auth = getAuth();

    let [userlist, setUserlist] = useState([])
    let [friendReq, setFriendReq] = useState([])
    let [friends, setFriends] = useState([])
    let [btnChange, setBtnChange] = useState(false)

    useEffect(()=>{
        let userArr = []
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
        snapshot.forEach((item) => {
            userArr.push({
                username: item.val().username,
                email: item.val().email,
                id: item.key
            })
        })
        setUserlist(userArr)
        });
    }, [])

    useEffect(() => {
        let friendReqarr = []
        const friendreqRef = ref(db, 'friendreq/');
        onValue(friendreqRef, (snapshot) => {
        snapshot.forEach((item) => {
            friendReqarr.push(item.val().receiverid+item.val().senderid)
        })
        setFriendReq(friendReqarr)       
        });
    }, [btnChange])

    useEffect(() => {
        let friendsarr = []
        const friendsRef = ref(db, 'friends/');
        onValue(friendsRef, (snapshot) => {
        snapshot.forEach((item) => {
            friendsarr.push(item.val().receiverid+item.val().senderid)
        })
        setFriends(friendsarr)       
        });
    }, [])
    
    let handleFrndReq = (frndInfo) => {
        set(push(ref(db, 'friendreq/')), {
            sendername: auth.currentUser.displayName,
            senderid: auth.currentUser.uid,
            receivername: frndInfo.username,
            receiverid: frndInfo.id,
          });
        setBtnChange(!btnChange)
    }
    

  return (
    <div className='grouplist frndlist userlist'>
        <h2>User List</h2>
        <div className='dots'>
            <BsThreeDotsVertical/>
        </div>

        {userlist.map(item => (
            auth.currentUser.uid !== item.id &&
            <div className='box'>
                <div className='img'>
                    <img src='assets/images/userlist.png' alt='group-img'/>
                </div>
                <div className='name'>
                    <h3>{item.username}</h3>
                    <h4>{item.email}</h4>
                </div>

                {friends.includes(auth.currentUser.uid+item.id) || friends.includes(item.id+auth.currentUser.uid)?
                <div className='btn'>
                    <button><FaUserFriends/></button>
                </div>
                :
                friendReq.includes(auth.currentUser.uid+item.id) || friendReq.includes(item.id+auth.currentUser.uid)
                ?
                <div className='btn'>
                    <button>&#x2714;</button>
                </div>
                :
                <div className='btn'>
                    <button onClick={()=> handleFrndReq(item)}>+</button>
                </div>
                }
                
            </div>
        ))}

        
    </div>
  )
}

export default UserList