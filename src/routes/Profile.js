import React, { useEffect, useState } from "react";
import {authService, dbService, storageService} from "fBase";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, setDoc, where, doc } from "firebase/firestore";
import { updateProfile } from "@firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCentercode } from "@fortawesome/free-brands-svg-icons";
import { uuidv4 } from "@firebase/util";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export default ({refreshUser, userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [attachment, setAttachment] = useState()
    const [fchanged, setFchanged] = useState(false)
    const [defaultURL,setDefaultURL] = useState("")
    const onLogOutClick = () => {
      authService.signOut();
      history.push("/");
      
    };
    /*const getMyTweets = async() => {
      const q = query(
        collection(dbService, "tweets"),
        where("creatorId", "==", userObj.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        });
        };
    useEffect(() => {
      getMyTweets();
    }, []);*/

    const onChange = (event) => {
      const {
        target: {value}, } = event;
      setNewDisplayName(value); 
      
    };

    const onFileChange = (event) => {
      const {
        target: {files},
      } = event;
      const theFile = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const{
          currentTarget: {result},
        } = finishedEvent;
        setAttachment(result);
      };
      reader.readAsDataURL(theFile);
      console.log(files)
    };

    const updateDisplayObj = (obj, newDisplay) =>{
      const tempObj = {...obj, displayName: newDisplay}
      delete tempObj.updateProfile
      return tempObj;
    }

    const updatePhotoObj = (obj, newURL) =>{
      const tempObj = {...obj, photoURL:newURL}
      delete tempObj.updateProfile
      return tempObj;
    }

    const onSubmit = async (event) => {
      event.preventDefault();
      if(userObj.displayName !== newDisplayName){
        await updateProfile(authService.currentUser, { displayName: newDisplayName });
        refreshUser();
        setDoc(doc(dbService,"users",userObj.uid),updateDisplayObj(userObj, newDisplayName))
        }

      if(attachment !== userObj.photoURL){
        let profileURL
        let response
        const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

        if(attachment !== defaultURL){
          response = await uploadString(attachmentRef, attachment, "data_url");
          profileURL = await getDownloadURL(response.ref);
          
        }

        await updateProfile(authService.currentUser, { photoURL: profileURL });
        refreshUser();
        setDoc(doc(dbService,"users",userObj.uid),updatePhotoObj(userObj, profileURL))
      }

    };
    
    const onDefaultClick = () => setAttachment(defaultURL)


    useEffect(() => {
      setAttachment(userObj.photoURL)
      if(!fchanged){
        setFchanged(true)
        setDefaultURL(userObj.photoURL)
      }
    });

    return (
      <div className="container">
      <form onSubmit={onSubmit} className="profileForm">



      {attachment && (
        <div className="factoryForm__attachment">
        <img
        src={attachment}
        style={{
          backgroundImage: attachment,
          marginLeft: 120,
        }}
        />
        <div className="factoryForm__clear" onClick={onDefaultClick}>
        <span>Cancel</span>
        <FontAwesomeIcon icon={faTimes} />
        </div>
        </div>
        )}

      <p>
          <label htmlFor="attach-file" className="factoryInput__label">
        <span>Change Photo</span>
        <FontAwesomeIcon icon={faPlus} />
        </label></p>
      
      <input id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }} />
        
        
        <input onChange={onChange} type="text"
        autoFocus
        placeholder="Display name"
        value={newDisplayName}
        className="formInput"
        />

        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }} />
        
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
    );
  };