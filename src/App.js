import React, { useEffect, useState } from 'react';
import { HashRouter, Link, Routes, Route } from 'react-router-dom'
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, setDoc, query, where, doc, exists, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';
import Logo from './images/iconmonstr-twitter-1.svg'
import { Home } from './components/Home';
import { Profile } from './components/Profile';

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [interaction, setInteraction] = useState(false);
  const [currentProfile, setCurrentProfile] = useState([])

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
    user();
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

  const user = async () => {
    const docRef = doc(db, 'users', getUID())
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data())
    } else {
      await setDoc(doc(db, 'users', getUID()), {
        name: getUserName(),
        id: getUID(),
        likes: [],
        retweets: [],
        tweets: [],
      })
    }
  }

  const getUserInteractions = async () => {
    const user = doc(db, 'users', getUID())
    const tweets = await getDocs(collection(db, 'tweets'))
    updateDoc(user, {
      tweets: [],
      likes: [],
      retweets: [],
    })
    tweets.forEach((tweet) => {
      if (tweet.data().likes.includes(getUID())) {
        updateDoc(user, {
          likes: arrayUnion(tweet.data())
        })
      }
      if (tweet.data().retweets.includes(getUID())) {
        updateDoc(user, {
          retweets: arrayUnion(tweet.data())
        })
      }
      if (tweet.data().author === getUID()) {
        updateDoc(user, {
          tweets: arrayUnion(tweet.data())
        })
      }
    })
  }



  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home getUserInteractions={getUserInteractions} checkSignIn={checkSignIn} signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} uid={getUID} tweets={tweets} setTweets={setTweets} interaction={interaction} setInteraction={setInteraction} />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
