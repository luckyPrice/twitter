import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateProfile } from "@firebase/auth";
import { dbService, storageService } from "fBase";
import {orderBy, onSnapshot, query, getDocs, addDoc, collection, doc } from "firebase/firestore";

function App() {
  console.log(authService.currentUser);
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=>{

    

    authService.onAuthStateChanged(async (user)=>{
      if(user){
        
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
          });

          
          
          
      }else{
        
        setUserObj(null);
      }
      setInit(true);
  });
  }, []);
  const refreshUser = () => {
    
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
      });
      
  };
  return (
    <>
      {init ? (

        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
    
    
  
}

export default App;
