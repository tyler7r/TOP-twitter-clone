import React, { useState } from 'react';
import { Header } from './Header';
import { WriteTweet } from './Tweets/WriteTweet';
import { DisplayTweets } from './Tweets/DisplayTweets';
import { Search } from './Search';
import '../styles/feed.css'

export const Home = (props) => {
    const { setSearch, setSearchMode, setCurrentProfile, setInteraction, signIn, logOut, isUserSignedIn, profilePic, username, uid, checkSignIn, tweets, setTweets, search, currentProfile, currentUser, setProfileView, setHomeView, searchMode } = props; 

    const [draftMode, setDraftMode] = useState(false);
    
    return (
        <div id='home-page'>
            {/* <div id='home-page-header'> */}
                <Header setProfileView={setProfileView} setSearch={setSearch} setSearchMode={setSearchMode} setCurrentProfile={setCurrentProfile} setInteraction={setInteraction} signIn={signIn} logOut={logOut} isUserSignedIn={isUserSignedIn} profilePic={profilePic} username={username} currentUser={currentUser} />
                <Search setDraftMode={setDraftMode} setInteraction={setInteraction} setSearchMode={setSearchMode} search={search} setSearch={setSearch} />
                <HomeView setDraftMode={setDraftMode} setHomeView={setHomeView} checkSignIn={checkSignIn} setInteraction={setInteraction} searchMode={searchMode} />
                <WriteTweet currentUser={currentUser} uid={uid} checkSignIn={checkSignIn} tweets={tweets} setTweets={setTweets} draftMode={draftMode} setDraftMode={setDraftMode} profilePic={profilePic} username={username} setInteraction={setInteraction} searchMode={searchMode} />
            {/* </div> */}
            <DisplayTweets setSearchMode={setSearchMode} setSearch={setSearch} draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} uid={uid} checkSignIn={checkSignIn} username={username} profilePic={profilePic} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} currentUser={currentUser} setProfileView={setProfileView} />
        </div>
    )
}

const HomeView = (props) => {
    const { setDraftMode, setHomeView, checkSignIn, setInteraction, searchMode } = props;

    const clickedView = (view) => {
        let allBtn = document.querySelector(`#home-view-all`);
        let followingBtn = document.querySelector(`#home-view-following`);
        if (view === 'all') {
            allBtn.classList.add('selected-home-view')
            followingBtn.classList.remove('selected-home-view')
            setHomeView('all')
        } else if (view === 'following') {
            allBtn.classList.remove('selected-home-view');
            followingBtn.classList.add('selected-home-view')
            setHomeView('following');
        }
        setDraftMode(false)
    }

    if (searchMode === false) {
        return (
            <div id='home-view-select'>
                <div onClick={() => {if(checkSignIn()) {setInteraction(true); clickedView('all')}}} className='home-view-btn selected-home-view' id='home-view-all'>All Tweets</div>
                <div onClick={() => {if(checkSignIn()) {setInteraction(true); clickedView('following')}}} className='home-view-btn' id='home-view-following'>Following</div>
            </div>
        )
    }
}