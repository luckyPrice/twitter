import { dbService, storageService } from "fBase";
import {v4 as uuidv4} from "uuid";
import {orderBy, onSnapshot, query, getDocs, addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Tweet from "components/Tweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import TweetFactory from "components/TweetFactory";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc, updateDoc }from "firebase/firestore";
import { faArrowDownUpAcrossLine } from "@fortawesome/free-solid-svg-icons";



const View = ({userObj, isOwner, destuser, id}) => { // 실제로그인 유저, 일치하는가, 상대방
    const [users, setUsers] = useState([])
    const [userlist, setuserlist] = useState(destuser.follows);
    const [userlist2, setuserlist2] = useState(userObj.followings);
    
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
            
            for(let i = 0 ; i < userArr.length ; i++){
                if(userArr[i].uid == userObj.uid){
                    id = userArr[i].id;
                    console.log(id);
                }
            }

    }, []);
})

    

    const onFollow = async () => {
        console.log(destuser);
        let found = 0;
        let i = 0;
        const FollowTextRef =doc(dbService, "users", `${destuser.id}`);
        const FollowingTextRef =doc(dbService, "users", `${id}`);
            console.log(destuser.follow);
            for(i = 0 ; i < destuser.follow ; i++){
                console.log(destuser.follow);
                console.log(destuser.follows[i])
                console.log(userObj.uid)
                if(destuser.follows[i] == userObj.uid){
                    found = 1;
                    console.log("ok");
                }
            }
            if(found == 0){ // Follow
                console.log(destuser)
                console.log(destuser.follows)
                console.log(destuser.followings)
                console.log(userlist)
                console.log(userObj.uid)
                console.log(userlist2)
                console.log(destuser.uid)
                const newList = userlist.concat(userObj.uid)
                const newList2 = userlist2.concat(destuser.uid)
                console.log(newList)
                console.log(newList2)
                console.log(destuser.id)
                console.log(userObj.id)
                destuser.follow++;
                destuser.follows = newList;
                userObj.following++;
                userObj.followings = newList2;
                
                await updateDoc(FollowTextRef, {
                    follows: newList,
                    follow : newList.length,
                    });
                await updateDoc(FollowingTextRef, {
                    followings: newList2,
                    following : newList2.length,
                    });
                
            }
            else{ // UnFollow
                const newList = userlist.filter(sch => sch != userObj.uid)
                const newList2 = userlist2.filter(sch => sch != destuser.uid)
                destuser.follow--;
                destuser.follows = newList;
                userObj.following--;
                userObj.followings = newList2;
                
                await updateDoc(FollowTextRef, {
                    follows: newList,
                    follow : newList.length,
                    });
                await updateDoc(FollowingTextRef, {
                    followings: newList2,
                    following : newList2.length,
                    });
            }
        
        
            
    }

    return(
    
    <>
        <form>
            <div>
            <table>
                <tr><th>hello</th></tr>
                <tr>
                <td>follower</td>
                <td>following</td>
                

                </tr>
                
                </table>
                </div>
                </form>
                
               
                <form>
                <div>
                <span onClick={onFollow} className="followBtn">
                follow
                 </span>
                 </div> 
                 </form>
                 </>
    );
                 
                
        
    
}

export default View;