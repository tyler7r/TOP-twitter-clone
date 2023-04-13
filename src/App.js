import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, query, where, doc, exists } from 'firebase/firestore';
import { db } from './firebase';
import Logo from './images/iconmonstr-twitter-1.svg'
import { Home } from './components/Home';

function App() {
  const [signedIn, setSignedIn] = useState(false)
  const [tweets, setTweets] = useState([]);
  const [interaction, setInteraction] = useState(false);

  useEffect(() => {
    console.log('run');
    let empty = [];
    const getTweets = async () => {
      const querySnapshot = await getDocs(collection(db, 'tweets'))
      querySnapshot.forEach((doc) => {
        empty.push(doc.data());
        empty[empty.length - 1].id = doc.id;
      })
      if (empty.length === tweets.length && interaction === false) return;
      else setTweets(empty);
      setInteraction(false);
    }
    getTweets();
  }, [tweets, interaction]);

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

  const checkSignIn = () => {
    if (signedIn === true) return true
    else {
      signIn();
    }
  }

  const getUID = () => {
    return getAuth().currentUser.uid;
  }

  return (
    <div className="App">
      <Home checkSignIn={checkSignIn} signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} uid={getUID} tweets={tweets} setTweets={setTweets} interaction={interaction} setInteraction={setInteraction} />
    </div>
  );
}

export default App;
