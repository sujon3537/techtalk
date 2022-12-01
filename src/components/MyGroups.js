import React, {useEffect, useState} from 'react'
import {BsThreeDotsVertical} from 'react-icons/bs'
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const MyGroups = () => {
    const auth = getAuth()
    const db = getDatabase();

    let [groupList, setGroupList] = useState([])

    useEffect(()=>{
        let groupArr = []
        const groupRef = ref(db, 'groups/');
        onValue(groupRef, (snapshot) => {
            snapshot.forEach((item)=>{
                let groupInfo = {
                    groupname: item.val().groupname,
                    groupadmin: item.val().groupadmin,
                    groupadminid: item.val().groupadminid,
                    grouptagline: item.val().grouptagline,
                    date: item.val().date,
                    key: item.key,
                }
                groupArr.push(groupInfo)
            });
            setGroupList(groupArr)
        });
    },[])

  return (
    <div className='grouplist frndlist'>
        <h2>My Groups</h2>
        <div className='dots'>
            <BsThreeDotsVertical/>
        </div>
        {groupList.map((item)=>(
            item.groupadminid == auth.currentUser.uid&&
             <div className='box'>
             <div className='img'>
                 <img src='assets/images/group-img.png' alt='group-img'/>
             </div>
             <div className='name'>
                 <h3>{item.groupname}</h3>
                 <h4>{item.grouptagline}</h4>
             </div>
             <div className='btn'>
                <p>{item.date}</p>
             </div>
         </div>
        ))}
    </div>
  )
}

export default MyGroups