import {React, useState, useEffect} from 'react'
import {AiOutlineHome, AiOutlineMessage, AiOutlineSetting, AiOutlineCloudUpload} from 'react-icons/ai'
import {IoMdNotificationsOutline, } from 'react-icons/io'
import {HiOutlineLogout} from 'react-icons/hi'
import { getAuth, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { Link, useNavigate} from "react-router-dom"
import { Modal, Box, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Leftbar = (props) => {
  const auth = getAuth();
  const storage = getStorage();
  const navigate = useNavigate()


  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [id, setId] = useState("")
  const [creationTime, setCreationTime] = useState("")
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploaded,setUploaded] = useState(false)

  let handleModalOpen = () => {
    setOpen(true)
  }
  let handleModalClose = () => {
    setOpen(false)
  }
  let handleModalOpen2 = () => {
    setOpen2(true)
  }
  let handleModalClose2 = () => {
    setOpen2(false)
  }

  let handleSignout = () => {
    signOut(auth).then(() => {
      console.log("signed out")
      navigate('/login')
    }).catch((error) => {
      console.log(error)
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName)
        setEmail(user.email)
        setId(user.uid)
        setCreationTime(user.metadata.creationTime)
      }
    });
  }, [uploaded])

  let handleProfilePic = (e) => {
    console.log(e.target.files[0])

    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  const getCropData = () => {
    setLoading(true)
    if (typeof cropper !== "undefined") {
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        setLoading(false)
        setOpen2(false)
        setImage("")
        getDownloadURL(storageRef)
        .then((url) => {
          updateProfile(auth.currentUser, {
            photoURL: url
          }).then(() => {
            console.log("uploaded")
            setUploaded(!uploaded)
          }).catch((error) => {
            console.log(error)
          });
        })
      });
    }
  };

  return (
    <div className='leftbar'>
      <div className='profilepicbox'>
        {!auth.currentUser.photoURL?
          <img className='profilepic' src="assets/images/avatar profile pic.png"/>
        :
          <img className='profilepic' src={auth.currentUser.photoURL}/>
        }
        <div className='overlay' onClick={handleModalOpen2}><AiOutlineCloudUpload/></div>
      </div>
      <h5 onClick={handleModalOpen}>{name}</h5>
      <div className='left-option'>
        <ul>
          <li className={props.active == 'home' && 'active'}>
            <Link to="/home">
              <AiOutlineHome className='Icon'/>
            </Link>
          </li>
          <li className={props.active == 'chat' && 'active'}>
            <Link to="/chat">
              <AiOutlineMessage className='Icon'/>
            </Link>
          </li>
          <li className={props.active == 'notification' && 'active'}><IoMdNotificationsOutline className='Icon'/></li>
          <li className={props.active == 'setting' && 'active'}><AiOutlineSetting className='Icon'/></li>
          <li onClick={handleSignout}><HiOutlineLogout className='Icon'/></li>
        </ul>
      </div>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='leftbarModal'
      >
        <Box className='leftbarModalBox'>
          <Typography id="modal-modal-title" variant="h6" component="h2">Account Information</Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            <ul className='leftbarUserInfo'>
              <li><span>Your Id: </span>{id}</li>
              <li><span>Your Email: </span>{email}</li>
              <li><span>You have joined: </span>{creationTime}</li>
            </ul>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={open2}
        onClose={handleModalClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='leftbarModal'
      >
        <Box className='leftbarModalBox'>
          <Typography id="modal-modal-title" variant="h6" component="h2">Change Profile Picture</Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            <div className='profilepicbox'>
              {!auth.currentUser.photoURL
                ?
                image
                ?
                <div className='img-preview'></div>
                :
                <img className='profilepic' src="assets/images/avatar profile pic.png"/>
                :
                image
                ?
                <div className='img-preview'></div>
                :
                <img className='profilepic' src={auth.currentUser.photoURL}/>
              }
            </div>
            
            <input type="file" onChange={handleProfilePic}/>
            <Cropper
              style={{ height: 200, width: "50%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
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
            {image ?
              <>
                {loading?
                <LoadingButton loading loadingIndicator="" variant="outlined" style={{color: '#fff'}}>
                 Uploading...
                </LoadingButton>
                :
                <button onClick={getCropData}>
                  Upload Profile Picture
                </button>
                }
              </>
              :
              ""
            }
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}

export default Leftbar