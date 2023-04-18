import React, { useState } from 'react';
import { Header } from './Header';
import { WriteTweet } from './Tweets/WriteTweet';
import { DisplayTweets } from './Tweets/DisplayTweets';
import { Search } from './Search';
import '../styles/feed.css'

export const Home = (props) => {
    const { setSearch, setSearchMode, setCurrentProfile, setInteraction, signIn, logOut, isUserSignedIn, profilePic, username, uid, checkSignIn, tweets, setTweets, search, currentProfile, currentUser, setProfileView } = props; 

    const [draftMode, setDraftMode] = useState(false);
    
    return (
        <div id='home-page'>
            <Header setSearch={setSearch} setSearchMode={setSearchMode} setCurrentProfile={setCurrentProfile} setInteraction={setInteraction} signIn={signIn} logOut={logOut} isUserSignedIn={isUserSignedIn} profilePic={profilePic} username={username} />
            <Search setInteraction={setInteraction} setSearchMode={setSearchMode} search={search} setSearch={setSearch} />
            <WriteTweet uid={uid} checkSignIn={checkSignIn} tweets={tweets} setTweets={setTweets} draftMode={draftMode} setDraftMode={setDraftMode} profilePic={profilePic} username={username}  setInteraction={setInteraction} />
            <DisplayTweets setSearchMode={setSearchMode} setSearch={setSearch} draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} uid={uid} checkSignIn={checkSignIn} username={username} profilePic={profilePic} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} currentUser={currentUser} setProfileView={setProfileView} />
        </div>
    )
}