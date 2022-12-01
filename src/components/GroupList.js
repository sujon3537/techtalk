import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Modal, TextField} from '@mui/material';
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage, ref as storref, uploadString, getDownloadURL } from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const GroupList = () => {
    const auth = getAuth()
    const db = getDatabase();
    const storage = getStorage();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let [groupName, setGroupName] = useState("")
    let [groupTagline, setGroupTagline] = useState("")
    let [groupImg, setGroupImg] = useState("")
    let [groupList, setGroupList] = useState([])
    let [loading, setLoading] = useState(false)
    let [check, setCheck] = useState(false)

    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const inputstyle = {
        width: '100%',
        margin: '10px 0'
    }

    let handleGrpImg = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
        files = e.dataTransfer.files;
        } else if (e.target) {
        files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setGroupImg(reader.result);
        };
        reader.readAsDataURL(files[0]);
    }


    //===========Trying to upload group image without cropper==============
    // let handleGroupImgUpload =(e) => {
    //     const storageRef = ref(storage, 'groupname');
    //     uploadBytes(storageRef, groupImg).then((snapshot) => {
    //     console.log('Uploaded a blob or file!')
    //     }).catch((error)=>{
    //         console.log("error", error)
    //     });
    // }

    const getCropGroupImg = () => {
        setLoading(true)
        if (typeof cropper !== "undefined") {
          const storageRef = storref(storage, groupName);
          const message4 = cropper.getCroppedCanvas().toDataURL();
          uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            setLoading(false)
            setGroupImg("")
            getDownloadURL(storageRef)
            // .then((url) => {
            //   updateProfile(auth.currentUser, {
            //     photoURL: url
            //   }).then(() => {
            //     console.log("uploaded")
            //     setUploaded(!uploaded)
            //   }).catch((error) => {
            //     console.log(error)
            //   });
            // })
          });
        }
      };

    let handleCreateGroup = () => {
        const db = getDatabase();
        set(push(ref(db, 'groups')), {
            groupname: groupName,
            grouptagline: groupTagline,
            groupadmin: auth.currentUser.displayName,
            groupadminid: auth.currentUser.uid,
            date: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
        }).then(()=>{
            setOpen(false)
            setCheck(!check)
        })
    }
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
    },[check])

    let handleJoinGroup = (adminId, groupId) => {
        set(push(ref(db, 'groupjoinreq')), {
            adminid: adminId,
            groupid: groupId,
            userid: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            userprofile: auth.currentUser.photoURL,
        });
    }

  return (
    <div className='grouplist'>
        <div className='groupHeader'>
            <h2>Group List</h2>
            <div className='btn'>
                <button onClick={handleOpen}>Create Group</button>
            </div>
        </div>
        {groupList.map((item)=>(
            item.groupadminid != auth.currentUser.uid&&
             <div className='box'>
             <div className='img'>
                 <img src='assets/images/group-img.png' alt='group-img'/>
             </div>
             <div className='name'>
                 <h3>{item.groupname}</h3>
                 <h4>{item.grouptagline}</h4>
             </div>
             <div className='btn'>
                 <button onClick={()=>handleJoinGroup(item.groupadminid, item.key)}>Join</button>
             </div>
         </div>
        ))}

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='createGrpModal'
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Fill the fields
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <TextField id="outlined-basic" label="Group Name" variant="outlined" sx={inputstyle} onChange={(e)=>setGroupName(e.target.value)}/>
                <TextField id="outlined-basic" label="Group Tagline" variant="outlined" sx={inputstyle} onChange={(e)=>setGroupTagline(e.target.value)}/>
                <span>Upload Group Photo:</span>
                <div className='profilepicbox'>
                    {!auth.currentUser.photoURL
                        ?
                        groupImg
                        ?
                        <div className='img-preview'></div>
                        :
                        <img className='profilepic' src="assets/images/avatar profile pic.png"/>
                        :
                        groupImg
                        ?
                        <div className='img-preview'></div>
                        :
                        <img className='profilepic' src={groupImg}/>
                    }
                </div>
                <input type='file' onChange={handleGrpImg}/>
                <Cropper
                    style={{ height: 200, width: "50%" }}
                    zoomTo={0.5}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={groupImg}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                    guides={true}
                />
                {groupImg?
                    <>
                    {loading?
                    <button>Uploading...</button>
                    :
                    <button onClick={getCropGroupImg}>
                    Upload Profile Picture
                    </button>
                    }
                    </>
                    :
                    ""
                }
                {/* <button className='upGrpImgBtn' onClick={getCropGroupImg}>Upload Image</button> */}
                <button onClick={handleCreateGroup}>Create Group</button>
            </Typography>
            </Box>
        </Modal>
    </div>
  )
}

export default GroupList