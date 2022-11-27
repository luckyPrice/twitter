import { authService, dbService, storageService } from "fBase";
import React, { useEffect, useState, useRef } from "react";
import { doc, getDoc, deleteDoc, updateDoc }from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {Route} from 'react-router-dom';
import styled, {css} from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faHeartBroken, faHeartCircleMinus, faPersonWalkingDashedLineArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser, faUserCircle, faHeart } from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {orderBy, onSnapshot, query, getDocs, addDoc, collection, where } from "firebase/firestore";

const FirendsProfile = ({user}) => {
/*     const getUserData = async () => {
        const uid = user.user
        console.log(uid)
        const userRef = collection(dbService, "users")
        const q = query(userRef, where("uid", "==", uid))

        const data = await getDocs(q);

        const dataArr = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          }));

        console.log(dataArr[0])
    } */


    useEffect(() => {
        //getUserData()
        console.log(user)
      });

    return (
        user ? 
        <div className="container">
        
  
  
        
          {user.photoURL && (
          <div className="factoryForm__attachment">
          <img
          src={user.photoURL}
          style={{
            backgroundImage: user.photoURL,
            marginLeft: 120,
          }}
          />
          </div>
          )}
  
          <h4>name : {user.displayName ? user.displayName: "username"}</h4>
          <br/>
          <h4>email : {user.email ? user.email : "email"} </h4>
          <br/>
          <h4>following : {user.follwing ? user.following : "0"}</h4>
          <br/>
          <h4>follow : {user.follow ? user.follow : "0"}</h4>
          {console.log(user)}

      </div>

          :<>
          
          <h4>User does not exitst.</h4>
          </>
    );
}

export default FirendsProfile;