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
  const [currentUser, setCurrentUser] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');
  const [profileView, setProfileView] = useState('tweets');
  const [search, setSearch] = useState('')
  const [searchMode, setSearchMode] = useState(false);

  const getTweets = async () => {
    let empty = [];
    const querySnapshot = await getDocs(collection(db, 'tweets'))
    querySnapshot.forEach((doc) => {
      empty.push(doc.data());
    })
    setTweets(empty);
    setSearchMode(false);
    setSearch('')
    setInteraction(false);
  }

  useEffect(() => {
    console.log('also run');
    getTweets();
    checkInteractionStatus();
  }, [])

  useEffect(() => {
    checkInteractionStatus();
    if (interaction === false) return;
    else {
      if (currentProfile !== '') {
        getUserInteractions(currentProfile);
      } else if (searchMode === true) {
        getSearchResults(search)
      } else {
        getTweets();
      }
    }
  }, [interaction, currentProfile, searchMode]);

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
        if (profileView === 'likes') {
          empty.push(tweet.data());
        }
      }
      if (tweet.data().retweets.includes(author)) {
        updateDoc(user, {
          retweets: arrayUnion(tweet.data())
        })
        if (profileView === 'retweets') {
          empty.push(tweet.data())
        }
      }
      if (tweet.data().author === author) {
        updateDoc(user, {
          tweets: arrayUnion(tweet.data())
        })
        if (profileView === 'tweets') {
          empty.push(tweet.data())
        }
      }
    })
    setTweets(empty);
    setSearchMode(false);
    setSearch('');
    setInteraction(false);
  }

  const checkInteractionStatus = async () => {
    if (tweets.length === 0) return
    for (let i = 0; i < tweets.length; i++) {
      let getTweet = await getDoc(doc(db, 'tweets', tweets[i].id))
      const like = document.querySelector(`#${tweets[i].id}.like-btn`)
      const retweet = document.querySelector(`#${tweets[i].id}.retweet-btn`)
      if (getTweet.data().likes.includes(currentUser)) {
        like.classList.add('liked')
      } else {
        like.classList.remove('liked')
      }
      if (getTweet.data().retweets.includes(currentUser)) {
        retweet.classList.add('retweeted')
      } else {
        retweet.classList.remove('retweeted')
      }
    }
  }

  const getSearchResults = async (search) => {
    let empty = [];
    const tweets = await getDocs(collection(db, 'tweets'));
    tweets.forEach((tweet) => {
      if (tweet.data().message.includes(search) || tweet.data().name.includes(search)) {
        empty.push(tweet.data())
      }
    })
    setSearch('');
    setTweets(empty);
    setInteraction(false);
  }

  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home setSearchMode={setSearchMode} search={search} setSearch={setSearch} setProfileView={setProfileView} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} currentUser={currentUser} getUserInteractions={getUserInteractions} checkSignIn={checkSignIn} signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} uid={getUID} tweets={tweets} setTweets={setTweets} interaction={interaction} setInteraction={setInteraction} />} />
          <Route path='/profile' element={<Profile setSearchMode={setSearchMode} search={search} setSearch={setSearch} profileView={profileView} setProfileView={setProfileView} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} currentUser={currentUser} getUserInteractions={getUserInteractions} checkSignIn={checkSignIn} signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} uid={getUID} tweets={tweets} setTweets={setTweets} interaction={interaction} setInteraction={setInteraction}/>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
