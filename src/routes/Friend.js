import { dbService, storageService } from "fBase";
import {v4 as uuidv4} from "uuid";
import {orderBy, onSnapshot, query, getDocs, addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState, useSyncExternalStore } from "react";
import Tweet from "components/Tweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import TweetFactory from "components/TweetFactory";
import { getAuth, updateCurrentUser } from "firebase/auth";
import { doc, deleteDoc, updateDoc }from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faHeartBroken, faHeartCircleMinus, faPersonWalkingDashedLineArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser, faUserCircle, faHeart } from "@fortawesome/free-solid-svg-icons";
import View from "components/View";


const Friend = ({userObj}) => {
    const [users, setUsers] = useState([])
    const [tweets, setTweets] = useState([])
    const [viewing, setViewing] = useState(true)
    const [destuser, Setdestuser] = useState(null)
    var id = "";
    
    
    useEffect(() => {
        const q = query(
            collection(dbService, "users"),
            
            );
            onSnapshot(q, (snapshot) => {
            const userArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
        setUsers(userArr);
        console.log(userArr)
            });
            console.log(users)
    }, []);

    useEffect(() => {
        const p = query(
            collection(dbService, "tweets"),
            orderBy("createdAt", "desc")
            );
            onSnapshot(p, (snapshot) => {
            const tweetArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
        setTweets(tweetArr);
            });
        }, []);

    const profile = ((user) => {
        //event.defaultPrevented()
        
        console.log(user)
        console.log(userObj)
        console.log(user.id)
        
        Setdestuser(user)
        console.log(destuser)
        console.log(viewing)
        toggleViewing()
        
    } );

    const toggleViewing = () => setViewing(prev => !prev);
    

    

    return(
        viewing ? 
        <>
        <div>
            {users.map((user) =>
            <><div>
            <span onClick={() => profile(user)}>
            <FontAwesomeIcon icon={faUserCircle} color={"#04AAFF"} size="2x" className="profileicon2" />
            </span>
            {user.displayName}</div>
            <br></br>
            </>)}

        </div>
        </>
        :
        <>
        <div>
           <View userObj={userObj} isUser={userObj.uid === destuser.uid} destuser={destuser} id = {id}/>
        </div>
        </>
    )
}

export default Friend;