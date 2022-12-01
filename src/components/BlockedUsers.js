import React from 'react'
import {BsThreeDotsVertical} from 'react-icons/bs'

const BlockedUsers = () => {
  return (
    <div className='grouplist frndlist userlist'>
        <h2>Blocked Users</h2>
        <div className='dots'>
            <BsThreeDotsVertical/>
        </div>
        <div className='box'>
            <div className='img'>
                <img src='assets/images/userlist.png' alt='group-img'/>
            </div>
            <div className='name'>
                <h3>username</h3>
                <h4>email</h4>
            </div>
            <div className='btn'>
                <div className='info'>
                    <p>12/12/2012</p>
                    <button>Unblock</button>
                </div>
            </div>
        </div>
        <div className='box'>
            <div className='img'>
                <img src='assets/images/userlist.png' alt='group-img'/>
            </div>
            <div className='name'>
                <h3>username</h3>
                <h4>email</h4>
            </div>
            <div className='btn'>
                <div className='info'>
                    <p>12/12/2012</p>
                    <button>Unblock</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BlockedUsers