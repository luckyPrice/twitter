import { dbService, storageService } from "fBase";
import {v4 as uuidv4} from "uuid";
import {orderBy, onSnapshot, query, getDocs, addDoc, collection, limit, getDocsFromServer, startAt, endAt, startAfter } from "firebase/firestore";
import React, { useEffect, useState, memo } from "react";
import Tweet from "components/Tweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { updateDoc }from "firebase/firestore";
import { doc }from "firebase/firestore";
import {Link} from "react-router-dom";
import { authService } from "fBase";
import Loader from "./Loader";
import { async } from "@firebase/util";

const TweetFactory = ({userObj}) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const [hashtag, setHashTag] = useState("");
    const [posting, setPosting] = useState(false);
    const [profile, setProfile] = useState(true);
    const [target, setTarget] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [defURL,setDefURL] = useState("");
    var firstLoaded=0;
    var lastdata;
    const onSubmit = async (event) => {
        if (tweet === "") {
            return;
          }
        event.preventDefault();
        let attachmentUrl = "";
        
        if(attachment !== ""){
            
        const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        
        const response = await uploadString(attachmentRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(response.ref);
        }
        for(let i = 0 ; i < tweets.length; i++){
          updateDoc(doc(dbService, "tweets", `${tweets[i].id}`), {
            count: 1,
            });
          }
        console.log(attachment, attachmentUrl);
        const tweetObj = {
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
            count: 1,
            hashTag: "#" + hashtag,
            user: authService.currentUser.email,
            heart: 0,
            heartuser : [],
            name: userObj.displayName,
            view : 0,
            userURL : userObj.photoURL,
            };
        await addDoc(collection(dbService, "tweets"), tweetObj);
        
        setTweet("");
        setAttachment("");
        togglePosting();
        console.log(posting)
        window.location.replace("/");
        
    };

 

  

  
    const getMoreTweets = async () => {
      
        if(firstLoaded <= 0){
        let q = query(
          collection(dbService, "tweets"),
          orderBy("createdAt", "desc"),
          limit(5)
          );
        
        const dbTweets = await getDocs(q);
        const tweetArr = dbTweets.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          }));
        
        setTweets((tweets) => tweets.concat(tweetArr));
        lastdata=tweetArr[tweetArr.length-1].createdAt;
        firstLoaded++;
        }

        else{
          let q = query(
            collection(dbService, "tweets"),
            orderBy("createdAt", "desc"),
            limit(5),
            startAfter(lastdata)
            );
          
          const dbTweets = await getDocs(q);
          const tweetArr = dbTweets.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
          
          setTweets((tweets) => tweets.concat(tweetArr));
          lastdata=tweetArr[tweetArr.length-1].createdAt;
        }
      
      
    };

    const onIntersect = async ([entry], observer) => {
      
      if (entry.isIntersecting && !isLoaded) {
        setIsLoaded(true);
        observer.unobserve(entry.target);
        await getMoreTweets();
        observer.observe(entry.target);
        setIsLoaded(false);
      }

    };

    useEffect(() => {
      getDownloadURL(ref(storageService, 'images/default.jpg')).then((url) => {
        setDefURL(url)
      })
      console.log(userObj)
      let observer;
      if (target) {
        observer = new IntersectionObserver(onIntersect, {
          threshold: 0.4,

        });
        observer.observe(target);
      }
      return () => observer && observer.disconnect();
    }, [target  ]);




    const onChange = (event) =>{
        const {target:{value}, } = event;
        setTweet(value);
        

    };
    const onChange2 = (event) =>{
      const {target:{value}, } = event;
      setTweet(value);
      

  };
  const onChangeHash = (event) =>{
    const {target:{value}, } = event;
    setHashTag(value);
    

};

    
    
    const onFind = (event) => {
      
      console.log(authService.currentUser.email)
     
      if(tweet==""){
        for(let i = 0 ; i < tweets.length; i++){
          updateDoc(doc(dbService, "tweets", `${tweets[i].id}`), {
            count: 1,
            });
          }
          console.log("first");
      }
      else{
        for(let i = 0 ; i < tweets.length; i++){
          if(tweets[i].hashTag == "#" + tweet){
            updateDoc(doc(dbService, "tweets", `${tweets[i].id}`), {
              count: 1,
              });
          }else{
            updateDoc(doc(dbService, "tweets", `${tweets[i].id}`), {
              count: 0,
              });
              console.log("second");
          }
        }
      }
      
      console.log(tweets.length);
      
    };
    const togglePosting = () => {setPosting(prev => !prev)};
    
    const onFileChange = (event) => {
        const {target:{files}, } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) =>{
            const {
                currentTarget: { result },
              } = finishedEvent;
              setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => setAttachment("");
    return (
      
      posting ? 
      <>
      
        <form onSubmit={onSubmit} className="factoryForm">
          
        <div className="factoryInput__container">
        <table>
        <tr>
          <input
            className="factoryInput__input"
            value={tweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          </tr>
          <tr>
          <p>
          <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
        </label></p>
        </tr><tr><p>
          <input type="text" className="hashTaginput" onChange={onChangeHash} value={hashtag}/>#</p>
          </tr>
          <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
          </table>
        </div>
        

        <input id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }} />
        {attachment && (
        <div className="factoryForm__attachment">
        <img
        src={attachment}
        style={{
          backgroundImage: attachment,
        }}
        />
        <div className="factoryForm__clear" onClick={onClearAttachment}>
        <span>Remove</span>
        <FontAwesomeIcon icon={faTimes} />
        </div>
        </div>
        )}
        </form>
        </>
        :
        profile ? 
        <>
        
        <span onClick={togglePosting} className="postBtn">
          Post
        </span>
        
          
        <form onSubmit = {onFind} className="factoryForm2">
          
        <div className="factoryInput__container2">
          <input
            className="factoryInput__input2"
            value={tweet}
            onChange={onChange2}
            type="text"
            //placeholder="What do you want to find?"
            maxLength={120}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow2" />
          </div>
          
          </form>
        <div style={{ marginTop: 30 }}>

            {tweets.map((tweet) => (
                (tweet.count == 1 &&
                <Tweet key={tweet.id} tweetObj={tweet} isOwner = {tweet.creatorId === userObj.uid} currentuser = {userObj.uid} defprofile = {defURL}/>)
               
            ))}

            <div ref={setTarget} className="Target-Element">
              {isLoaded && <Loader />}
            </div>
        </div>
        
        
    </>
    : 
    <>
    </>
    )
}
export default TweetFactory;