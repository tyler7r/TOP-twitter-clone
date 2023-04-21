import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, setDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import Logo from './images/iconmonstr-twitter-1.svg'
import { Home } from './components/Home';
import { Profile } from './components/Profile';
import './styles/main.css';

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [interaction, setInteraction] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');
  const [profileView, setProfileView] = useState('tweets');
  const [search, setSearch] = useState('')
  const [searchMode, setSearchMode] = useState(false);
  const [homeView, setHomeView] = useState('all');
  const [userUpdate, setUserUpdate] = useState(false)

  const getTweets = async () => {
    let empty = [];
    const querySnapshot = await getDocs(collection(db, 'tweets'));
    querySnapshot.forEach((doc) => {
      updateTweets(doc);
      empty.push(doc.data());
    })
    setTweets(empty);
    setSearchMode(false);
    setSearch('')
    setInteraction(false);
  }

  const updateTweets = async(tweet) => {
    const user = await getDoc(doc(db, 'users', tweet.data().author))
    await updateDoc(doc(db, 'tweets', tweet.data().id), {
      profilePic: user.data().profilePic,
    })
  }

  useEffect(() => {
    getTweets();
  }, [])

  useEffect(() => {
    if (interaction === false) return; 
    else {
      if (currentProfile !== '') {
        getUserInteractions(currentProfile.id);
      } else if (searchMode === true) {
        getSearchResults(search)
      } else if (homeView === 'following') {
        getFollowingView();
      } else {
        getTweets();
      }
    }
  }, [interaction, currentProfile, searchMode, homeView, userUpdate]);

  useEffect(() => {
    checkInteractionStatus()
  }, [tweets])

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
    return getAuth().currentUser.photoURL;
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
        followers: [],
        following: [],
        profilePic: getProfilePic(),
        bioPic: '',
        bio: '',
      })
      setCurrentUser({
        name: getUserName(),
        id: getUID(),
        likes: [],
        retweets: [],
        tweets: [],
        followers: [],
        following: [],
        profilePic: getProfilePic(),
        bioPic: '',
        bio: '',
      })
    } else {
      setCurrentUser(docSnap.data());
    }
  }

  const getUserInteractions = async (author) => {
    let empty = [];
    const user = doc(db, 'users', author)
    const tweets = await getDocs(collection(db, 'tweets'))
    tweets.forEach((tweet) => {
      updateTweets(tweet)
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
          tweets: arrayUnion(tweet.data().id)
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
    for (let i = 0; i < tweets.length; i++) {
      let getTweet = await getDoc(doc(db, 'tweets', tweets[i].id))
      const like = document.querySelector(`#id${tweets[i].id}.like-btn`)
      const retweet = document.querySelector(`#id${tweets[i].id}.retweet-btn`)
      if (like === null && retweet === null) return;
      else if (currentUser !== '' && getTweet.exists()) {
        if (getTweet.data().likes.includes(currentUser.id)) {
          like.classList.add('liked')
        } else {
          like.classList.remove('liked')
        }
        if (getTweet.data().retweets.includes(currentUser.id)) {
          retweet.classList.add('retweeted')
        } else {
          retweet.classList.remove('retweeted')
        }
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
    setTweets(empty);
    setInteraction(false);
  }

  const getFollowingView = async () => {
    let empty = [];
    let getFollowedUsers = await getDoc(doc(db, 'users', currentUser.id));
    let followedUsers = getFollowedUsers.data().following;
    for (let i = 0; i < followedUsers.length; i++) {
      let getUser = await getDoc(doc(db, 'users', followedUsers[i].id))
      let userTweets = getUser.data().tweets
      for (let j = 0; j < userTweets.length; j++) {
        let getTweet = await getDoc(doc(db, 'tweets', userTweets[j]))
        empty.push(getTweet.data())
      }
    }
    setTweets(empty);
    setInteraction(false);
  }

  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home setSearchMode={setSearchMode} searchMode={searchMode} search={search} setSearch={setSearch} setProfileView={setProfileView} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} currentUser={currentUser} checkSignIn={checkSignIn} signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} uid={getUID} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} setHomeView={setHomeView} />} />
          <Route path='/profile/:id' element={<Profile setCurrentUser={setCurrentUser} userUpdate={userUpdate} setUserUpdate={setUserUpdate} setSearchMode={setSearchMode} search={search} setSearch={setSearch} profileView={profileView} setProfileView={setProfileView} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} currentUser={currentUser} checkSignIn={checkSignIn} signIn={signIn} isUserSignedIn={signedIn} logOut={logOutUser} profilePic={getProfilePic} username={getUserName} uid={getUID} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} interaction={interaction} setHomeView={setHomeView} />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
