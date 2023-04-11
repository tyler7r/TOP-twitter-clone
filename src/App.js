import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db } from './firebase';
import Logo from './images/iconmonstr-twitter-1.svg'
import { Home } from './components/Home';

function App() {
  const [signedIn, setSignedIn] = useState(false)

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
    setSignedIn(true);
  }

  const logOutUser = () => {
    signOut(getAuth());
    setSignedIn(false);
  }

  const getUserName = () => {
    return getAuth().currentUser.displayName
  }

  const getProfilePic = () => {
    if (signedIn === false) return <img src={Logo} alt='profile-pic'/>
    else {
      return <img src={getAuth().currentUser.photoURL} alt='profile-pic' />
    }
  }

  return (
    <div className="App">
      <Home signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} />
    </div>
  );
}

export default App;

// const isUserSignedIn = () => {
//     return !!getAuth().currentUser;
//   }
