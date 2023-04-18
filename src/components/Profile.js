import React, { useState } from 'react';
import { Header } from './Header';
import { DisplayTweets } from './Tweets/DisplayTweets';

export const Profile = (props) => {
    const { setCurrentProfile, setSearchMode, setSearch, signIn, logOut, isUserSignedIn, profilePic, username, setProfileView, setInteraction, currentProfile, profileView, uid, checkSignIn, currentUser, tweets, setTweets } = props;

    const [draftMode, setDraftMode] = useState(false)

    return (
        <div id='profile'>
            <div id='home-page'>
                <Header setSearch={setSearch} setSearchMode={setSearchMode} setCurrentProfile={setCurrentProfile} setInteraction={setInteraction} signIn={signIn} logOut={logOut} isUserSignedIn={isUserSignedIn} profilePic={profilePic} username={username} />
                <ProfileInfo currentProfile={currentProfile} />
                <ProfileNav profileView={profileView} setProfileView={setProfileView} setInteraction={setInteraction} />
                <DisplayTweets setSearchMode={setSearchMode} setSearch={setSearch} draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} uid={uid} checkSignIn={checkSignIn} username={username} profilePic={profilePic} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} currentUser={currentUser} setProfileView={setProfileView} />
            </div>
        </div>
    )
}

const ProfileInfo = (props) => {
    const { currentProfile } = props
    
    return (
        <div id='current-profile'>
            <div id='current-profile-info'>
                <img id='current-profile-pic' src={currentProfile.profilePic} alt='current-profile-pic' />
                <div id='current-profile-name'>{currentProfile.name}</div>
            </div>
        </div>
    )
}   

const ProfileNav = (props) => {
    const { setProfileView, setInteraction } = props;

    return (
        <div id='profile-nav'>
            <div onClick={() => {setProfileView('tweets'); setInteraction(true)}} id='tweets-view'>Tweets</div>
            <div onClick={() => {setProfileView('likes'); setInteraction(true)}} id='likes-view'>Likes</div>
            <div onClick={() => {setProfileView('retweets'); setInteraction(true)}} id='retweets-view'>Retweets</div>
        </div>
    )
}