import React, { useEffect, useState } from 'react'
import {BsThreeDotsVertical, BsCamera} from 'react-icons/bs'
import {FaPaperPlane} from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { getAuth } from "firebase/auth"
import { getDatabase, ref, set, push, onValue } from "firebase/database";

const Chatting = () => {
    const auth = getAuth();
    const db = getDatabase();
    const user = useSelector((state) => state.activeChat.active)

    let [chatMsg, setChatMsg] = useState("")
    let [chatMsgList, setChatMsgList] = useState([])

    let handleMsgInput = (e) => {
        setChatMsg(e.target.value)
    }

    let handleMsgSend = () => {
        if(chatMsg !=""){
            if(user.status == 'group'){
                console.log("ami group mesg")
            }else{
                set(push(ref(db, 'singlemsg')), {
                    whosendid: auth.currentUser.uid,
                    whosendname: auth.currentUser.displayName,
                    whoreceiveid: user.id,
                    whoreceivename: user.name,
                    message: chatMsg,
                });
            }
        }
    };

    useEffect(()=> {
        onValue(ref(db, 'singlemsg'), (snapshot) => {
            let msgarr = []
            snapshot.forEach(item =>{
                if(item.val().whosendid == auth.currentUser.uid && item.val().whoreceiveid == user.id ||
                item.val().whosendid == user.id && item.val().whoreceiveid == auth.currentUser.uid)
                msgarr.push(item.val());
            });
        setChatMsgList(msgarr)
        });
    }, [user.id])

  return (
    <div className='chatting-part'>
        <div className='topArea'>
            <div className='info'>
                <div className='image'>
                    <img src="./assets/images/frndreq.png"/>
                    <div className='circle'></div>
                </div>
                <div className='name'>
                    <h3>{user.name}</h3>
                    <p>Online</p>
                </div>
            </div>
            <div className='dots'><BsThreeDotsVertical/></div>
        </div>
        <div className='chatArea'>
            {chatMsgList.map((item)=>
                item.whosendid == auth.currentUser.uid ? (
                    <div style={alignRight} className='msg'>
                        <p style={msgSend}>{item.message}</p>
                        <p style={dateSend} className='date'>Today, 2:01pm</p>
                    </div>
                ) : (
                    <div style={alignLeft} className='msg'>
                        <p style={msgReceive}>{item.message}</p>
                        <p style={dateReceive} className='date'>Today, 2:01pm</p>
                    </div>
                )
            )}
            
            {/* <div style={alignLeft} className='msg'>
                <p style={msgReceive}>Cool! enjoing my train journey beside hills</p>
                <p style={dateReceive} className='date'>Today, 2:02pm</p>
            </div>
            <div style={alignLeft} className='msg'>
                <div style={msgReceive} className='msgImg'>
                    <img src="./assets/images/train.jpg"/>
                </div>
                <p style={dateReceive} className='date'>Today, 2:02pm</p>
            </div>
            <div style={alignRight} className='msg'>
                <div style={msgSend} className='msgImg'>
                    <img src="./assets/images/bus.jpg"/>
                </div>
                <p style={dateSend} className='date'>Today, 2:03pm</p>
            </div>
            <div style={alignRight} className='msg'>
                <p style={msgSend}>Me too! enjoing hill way with bus.</p>
                <p style={dateSend} className='date'>Today, 2:03pm</p>
            </div> */}
        </div>
        <div className='msgBox'>
            <div className='msgInput'>
                <input type="text" placeholder="Message" onChange={handleMsgInput}/>
                <BsCamera className='camIcon'/>
                <button onClick={handleMsgSend}><FaPaperPlane/></button>
            </div>
        </div>
    </div>
  )
}

let msgReceive = {
    background: "#F1F1F1",
}
let msgSend = {
    background: "#5F35F5",
    color: "#fff",
}
let dateReceive = {
    left: "-45px",
}
let dateSend = {
    right: "-45px",
}
let alignLeft = {
    justifyContent: "flex-start"
}
let alignRight = {
    justifyContent: "flex-end",
}

export default Chatting