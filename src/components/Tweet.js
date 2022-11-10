import { dbService, storageService } from "fBase";
import React, { useState } from "react";
import { doc, deleteDoc, updateDoc }from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({tweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    const TweetTextRef =doc(dbService, "tweets", `${tweetObj.id}`);
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
                <h4>{tweetObj.text}</h4>
                {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} className="pic" />}
                {isOwner && (
                <div className="nweet__actions">
                <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
                </span>
                <h3>{tweetObj.hashTag}</h3>
                </div>
                
                )}
                </>
            }
        </div>
    )
};

export default Tweet;