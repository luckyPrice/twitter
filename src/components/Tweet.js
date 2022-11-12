import { dbService, storageService } from "fBase";
import React, { useEffect, useState } from "react";
import { doc, deleteDoc, updateDoc }from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {Route} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faHeartBroken, faHeartCircleMinus, faPersonWalkingDashedLineArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser, faUserCircle, faHeart } from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {orderBy, onSnapshot, query, getDocs, addDoc, collection } from "firebase/firestore";

const Tweet = ({tweetObj, isOwner, currentuser}) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    const [heart, setHeart] = useState(false);
    const TweetTextRef =doc(dbService, "tweets", `${tweetObj.id}`);
    const [heartuserlist, setHeartuserlist] = useState(tweetObj.heartuser);
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        for(let i = 0 ; i < tweetObj.heart ; i++){
            if(tweetObj.heartuser[i] == currentuser){
                setHeart(true)
                console.log("ok");
            }
        }
    }, []);

    const gotoProfile = (event) => {
        console.log("input");
        event.preventDefault();
        
        const q = query(
            
            collection(dbService, "tweets"),
            orderBy("createdAt", "desc")
            );
            
             onSnapshot(q, (snapshot) => {
            const tweetArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
            
            console.log(tweetArr);
            setTweets(tweetArr);
            
            
            
            });
            
            
            console.log(tweets.length);
            
            for(let i = 0 ; i < tweets.length; i++){
                if(tweets[i].creatorId != currentuser){
                    updateDoc(doc(dbService, "tweets", `${tweets[i].id}`), {
                        count: 0,
                        });
                    console.log("third");
                    console.log(currentuser);
                    
                    }
                    else{
                        updateDoc(doc(dbService, "tweets", `${tweets[i].id}`), {
                            count: 1,
                            });
                        }
                        const p = query(
                            collection(dbService, "users"));
                        console.log("fourth");
                    }
            
        

    }

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet?");
        console.log(ok);
        if(ok){
            await deleteDoc(TweetTextRef);
            if (tweetObj.attachmentUrl !== "") {
                await deleteObject(ref(storageService, tweetObj.attachmentUrl));
            }
        }
    };
    const toggleEditing = () => setEditing(prev => !prev);
    const toggleHeart = () => {
        console.log(tweetObj);
        let found = 0;
        
            
            for(let i = 0 ; i < tweetObj.heart ; i++){
                if(tweetObj.heartuser[i] == currentuser){
                    found = 1;
                    console.log("ok");
                }
            }
            if(found == 0){
                const newList = heartuserlist.concat(currentuser)
                setHeartuserlist(newList)
                updateDoc(TweetTextRef, {
                    heartuser: newList,
                    heart : tweetObj.heart + 1,
                    });
                
            }
            else{
                const newList = heartuserlist.filter(sch => sch != currentuser)
                updateDoc(TweetTextRef, {
                    heartuser: newList,
                    heart : tweetObj.heart - 1,
                    });
            }
        
        setHeart(prev => !prev);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(tweetObj, newTweet);
        await updateDoc(TweetTextRef, {
            text: newTweet,
            });
        setEditing(false);
    };
    const onChange = (event) => {
        const {target:{value}, } = event;
        setNewTweet(value);
    };
    return(
        <div className="nweet">
            {
                editing ?
                <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                <input type ="text"
                palceholder="Edit your tweet"
                value={newTweet}
                required
                autoFocus
                onChange = {onChange}
                className="formInput"
                />
                <input type="submit" value="Update Tweet" className="formBtn" />
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
                </span>
                </>
                 :
                <>
                <h4 className="textview">{tweetObj.text}</h4>
                {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} className="pic" />}
                <span onClick={gotoProfile}>
                <FontAwesomeIcon icon={faUserCircle} color={"#04AAFF"} size="2x" className="profileicon" />
                </span>
                <h4 className="favorcount">{tweetObj.heart}</h4>
                <h3>{tweetObj.hashTag}</h3>
                {isOwner && (
                <><div className="nweet__actions">
                                
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                                


                            </div></>
                )}
                <div>
                                    <span onClick={toggleHeart}>

                                        {heart ?
                                            <FontAwesomeIcon icon={faHeart}  className="heart"/> :
                                            <FontAwesomeIcon icon={faHeartCircleMinus}  className="heart"/>}

                                    </span>
                                </div>
                </>
                
            }
        </div>
    )
};

export default Tweet;