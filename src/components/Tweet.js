import { dbService, storageService } from "fBase";
import React, { useEffect, useState, useRef } from "react";
import { doc, deleteDoc, updateDoc }from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {Route} from 'react-router-dom';
import styled, {css} from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faHeartBroken, faHeartCircleMinus, faPersonWalkingDashedLineArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser, faUserCircle, faHeart } from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {orderBy, onSnapshot, query, getDocs, addDoc, collection } from "firebase/firestore";

const Tweet = ({tweetObj, isOwner, currentuser, defprofile}) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    const [heart, setHeart] = useState(false);
    const TweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
    const [heartuserlist, setHeartuserlist] = useState(tweetObj.heartuser);
    const [tweets, setTweets] = useState([]);
    const [alreadyselected, setalreadyselected] = useState(0) // 이미 눌려있는지를 확인
    const [heartcount, setHeartcount] = useState(tweetObj.heart) // 현재 하트카운트를 측정하고 1차원적으로 1을 더하거나 뺌

    useEffect(() => { // 초기의 하트 상태
        
        for(let i = 0 ; i < tweetObj.heart ; i++){
            if(tweetObj.heartuser[i] == currentuser){
                setHeart(true)
                console.log("ok");
                setalreadyselected(1)
                
            }
        }
        
        
    }, []);


    

    const gotoProfile = (event) => { // 미구현
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
                    console.log(currentuser);
                    }
                    else{
                        updateDoc(doc(dbService, "tweets", `${tweets[i].id}`), {
                            count: 1,
                            });
                        }
                        const p = query(
                            collection(dbService, "users"));
                    }
    }
    const onDeleteClick = async () => { // 삭제후 새로고침
        const ok = window.confirm("Are you sure you want to delete this tweet?");
        console.log(ok);
        if(ok){
            await deleteDoc(TweetTextRef);
            if (tweetObj.attachmentUrl !== "") {
                await deleteObject(ref(storageService, tweetObj.attachmentUrl));
            }
        }
        window.location.replace("/");
    };

    
    const toggleEditing = () => setEditing(prev => !prev);
    const toggleHeart = () => {
        
        const TweetTextRef2 = doc(dbService, "tweets", `${tweetObj.id}`);
        console.log(tweetObj);
        
            if(alreadyselected == 0){ // 데이터베이스에 갱신하고 화면갱신
                const newList = heartuserlist.concat(currentuser)
                setHeartuserlist(newList)
                console.log(tweetObj.heart);
                updateDoc(TweetTextRef2, {
                    heartuser: newList,
                    heart : heartcount + 1,
                    });
                    console.log(TweetTextRef)
                    setalreadyselected(1)
                    setHeartcount(heartcount + 1)
            }
            else{ // 데이터베이스에 갱신하고 화면갱신
                const newList = heartuserlist.filter(sch => sch != currentuser)
                setHeartuserlist(newList)
                console.log(tweetObj.heart);
                updateDoc(TweetTextRef2, {
                    heartuser: newList,
                    heart : heartcount - 1,
                    });
                    console.log(TweetTextRef2)
                    setalreadyselected(0)
                    setHeartcount(heartcount - 1)
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
        window.location.replace("/");
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
                <div>
            
                     <img   
                     src={tweetObj.userURL ? tweetObj.userURL : defprofile}
                     style={{
                        marginRight:215,
                        marginTop:-125,
                        borderRadius:100,
                        width:30,
                        height:30
                    }}
                     /> 
                    <h4 style={{marginLeft:40}}>{tweetObj.user}</h4>
                </div>
                <h4 className="textview">{tweetObj.text}</h4>
                {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} className="pic" />}

                <h4 className="favorcount">{heartcount}</h4>
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