import { React, useEffect, useState} from 'react'
import {IoMdChatboxes} from 'react-icons/io'
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { activeChat } from '../slice/activeChatSlice';

const JoinedGroupList = () => {
    const dispatch = useDispatch()
    const db = getDatabase();
    const auth = getAuth()
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
                    key: item.key,
                }
                groupArr.push(groupInfo)
            });
            setGroupList(groupArr)
        });
    },[])

    let handleActiveChat = (item) => {
        let userInfo = {
            status: 'group',
            name: item.groupname,
            groupid: item.key,
            groupadminid: item.groupadminid,
        }
        dispatch(activeChat(userInfo));
    };

  return (
    <div className='grouplist'>
        <div className='groupHeader'>
            <h2>Group List</h2>
        </div>
        {groupList.map((item)=>(
             <div className='box' onClick={() => handleActiveChat(item)}>
             <div className='img'>
                 <img src='assets/images/group-img.png' alt='group-img'/>
             </div>
             <div className='name'>
                 <h3>{item.groupname}</h3>
                 <h4>{item.grouptagline} {item.groupadminid != auth.currentUser.uid? "" : "(Admin)"}</h4>
             </div>
             <div className='btn'>
                <button><IoMdChatboxes/></button>
             </div>
         </div>
        ))}
        {/* <div className='box'>
             <div className='img'>
                 <img src='assets/images/group-img.png' alt='group-img'/>
             </div>
             <div className='name'>
                 <h3>Devs</h3>
                 <h4>Groups of Developers</h4>
             </div>
             <div className='btn'>
                <button><IoMdChatboxes/></button>
             </div>
        </div>
        <div className='box'>
             <div className='img'>
                 <img src='assets/images/group-img.png' alt='group-img'/>
             </div>
             <div className='name'>
                 <h3>Devs</h3>
                 <h4>Groups of Developers</h4>
             </div>
             <div className='btn'>
                <button><IoMdChatboxes/></button>
             </div>
        </div> */}
    </div>
  )
}

export default JoinedGroupList