import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Logo from './images/iconmonstr-twitter-1.svg'
import { Home } from './components/Home';

function App() {
  const [signedIn, setSignedIn] = useState(false)
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    console.log(tweets);
    let copy = [...tweets];
    let empty = [];
    const getTweets = async () => {
      const querySnapshot = await getDocs(collection(db, 'tweets'))
      querySnapshot.forEach((doc) => {
        empty.push(doc.data());
        empty[empty.length - 1].id = doc.id;
      })
      if (empty.length === copy.length) return;
      else setTweets(empty);
    }
    getTweets();
  }, [tweets]);

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
    if (signedIn === true) return getAuth().currentUser.photoURL;
    else return Logo;
  }

  return (
    <div className="App">
      <Home signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} tweets={tweets} setTweets={setTweets} />
    </div>
  );
}

export default App;

// const isUserSignedIn = () => {
//     return !!getAuth().currentUser;
//   }
