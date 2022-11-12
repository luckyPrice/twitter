import { dbService, storageService } from "fBase";
import {v4 as uuidv4} from "uuid";
import {orderBy, onSnapshot, query, getDocs, addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Tweet from "components/Tweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import TweetFactory from "components/TweetFactory";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc, updateDoc }from "firebase/firestore";



const Home = ({userObj}) => {
    
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const [search, setSearch] = useState(false);
    const [users, setUsers] = useState([]);

    const auth = getAuth();
    const user = auth.currentUser;
    const getTweets = async()=>{
        const dbTweets = query(collection(dbService, "tweets"));
        const querySnapshot = await getDocs(dbTweets);
    querySnapshot.forEach((doc) => {
    const tweetObj = {
    ...doc.data(),
    id: doc.id,
    
    }
    setTweets(prev => [tweetObj, ...prev]);
    });
};  
    useEffect(() => {
        const q = query(
            collection(dbService, "tweets"),
            orderBy("createdAt", "desc")
            );
            onSnapshot(q, (snapshot) => {
            const tweetArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
        setTweets(tweetArr);
            });

            const querySnapshot = query(collection(dbService, "users"));
            console.log(querySnapshot);
            onSnapshot(querySnapshot, (snapshot) => {
                const userArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }));
            console.log(userArr);
            let find = 0;
            for(let i = 0 ; i < userArr.length; i++){
                if(user.uid == userArr[i].uid){
                    find = 1;
                }
            }
            if(find == 0){
                const userObj = {
                    displayName: user.email,
                    uid: user.uid,
                    following: 0, // 팔로잉 내가 한사람
                followings: [],
                follow: 0, // 팔로우 해준 사람
                follows: [],
                    };
                addDoc(collection(dbService, "users"), userObj);
            }
           // setUsers(userArr);
        });
            
            
    }, []);
    
   
   

    
    



    

    

    
    
    return(
        <div className="container">
        <TweetFactory userObj={userObj} />
        
        
        
    </div>
    );
};

export default Home;