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
  // const [userFeed, setUserFeed] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');

  const getTweets = async () => {
    let empty = [];
    const querySnapshot = await getDocs(collection(db, 'tweets'))
    querySnapshot.forEach((doc) => {
      empty.push(doc.data());
    })
    setTweets(empty);
    setInteraction(false);
  }

  useEffect(() => {
    console.log('also run');
    getTweets();
  }, [])

  useEffect(() => {
    if (interaction === false) return;
    else {
      if (currentProfile !== '') {
        getUserInteractions(currentProfile);
      } else {
        getTweets();
      }
    }
  }, [interaction, currentProfile]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
    setSignedIn(true);
    user();
    setInteraction(true);
  }

  const logOutUser = () => {
    signOut(getAuth());
    setSignedIn(false);
    setCurrentUser('');
    setInteraction(true);
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
    if (!docSnap.exists()) {
      await setDoc(doc(db, 'users', getUID()), {
        name: getUserName(),
        id: getUID(),
        likes: [],
        retweets: [],
        tweets: [],
      })
    }
    setCurrentUser(getUID());
  }

  const getUserInteractions = async (author) => {
    let empty = [];
    const user = doc(db, 'users', author)
    const tweets = await getDocs(collection(db, 'tweets'))
    updateDoc(user, {
      tweets: [],
      likes: [],
      retweets: [],
    })
    tweets.forEach((tweet) => {
      if (tweet.data().likes.includes(author)) {
        updateDoc(user, {
          likes: arrayUnion(tweet.data())
        })
      }
      if (tweet.data().retweets.includes(author)) {
        updateDoc(user, {
          retweets: arrayUnion(tweet.data())
        })
      }
      if (tweet.data().author === author) {
        updateDoc(user, {
          tweets: arrayUnion(tweet.data())
        })
        empty.push(tweet.data())
      }
    })
    setTweets(empty);
    setInteraction(false);
  }



  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} currentUser={currentUser} getUserInteractions={getUserInteractions} checkSignIn={checkSignIn} signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} uid={getUID} tweets={tweets} setTweets={setTweets} interaction={interaction} setInteraction={setInteraction} />} />
          <Route path='/profile' element={<Profile currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} currentUser={currentUser} getUserInteractions={getUserInteractions} checkSignIn={checkSignIn} signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} uid={getUID} tweets={tweets} setTweets={setTweets} interaction={interaction} setInteraction={setInteraction}/>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
