import React, { useEffect, useState } from "react";
import {authService, dbService} from "fBase";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { updateProfile } from "@firebase/auth";


export default ({refreshUser, userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
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
    const onSubmit = async (event) => {
      event.preventDefault();
      if(userObj.displayName !== newDisplayName){
        await updateProfile(authService.currentUser, { displayName: newDisplayName });
        refreshUser();
        }
    };
    

    return (
      <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
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