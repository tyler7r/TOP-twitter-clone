import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db } from './firebase';
import { Home } from './components/Home';

function App() {
  const [signedIn, setSignedIn] = useState(false)

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
    setSignedIn(true);
  }

  const signOutUser = () => {
    signOut(getAuth());
    setSignedIn(false);
  }

  const getUserName = () => {
    return getAuth().currentUser.displayName
  }

  const getProfilePic = () => {
    return getAuth().currentUser.photoURL
  }

  return (
    <div className="App">
      <Home signIn={signIn} isUserSignedIn={signedIn} signOut={signOutUser} profilePic={getProfilePic} username={getUserName} />
    </div>
  );
}

export default App;

// const isUserSignedIn = () => {
//     return !!getAuth().currentUser;
//   }
