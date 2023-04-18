import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { WriteTweet } from './Tweets/WriteTweet';
import { DisplayTweets } from './Tweets/DisplayTweets';
import { Search } from './Search';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

export const Profile = (props) => {
    const [draftMode, setDraftMode] = useState(false)

    return (
        <div id='profile'>
            <div id='home-page'>
                <Header setSearch={props.setSearch} setSearchMode={props.setSearchMode} setCurrentProfile={props.setCurrentProfile} setInteraction={props.setInteraction} signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
                {/* <Search setInteraction={props.setInteraction} setSearchMode={props.setSearchMode} search={props.search} setSearch={props.setSearch} /> */}
                <ProfileInfo currentProfile={props.currentProfile} />
                <ProfileNav profileView={props.profileView} setProfileView={props.setProfileView} setInteraction={props.setInteraction} />
                {/* <WriteTweet draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={props.currentProfile} setCurrentProfile={props.setCurrentProfile} getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} tweets={props.tweets} setTweets={props.setTweets} profilePic={props.profilePic} username={props.username} setInteraction={props.setInteraction}/> */}
                <DisplayTweets setSearchMode={props.setSearchMode} setSearch={props.setSearch} draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={props.currentProfile} setCurrentProfile={props.setCurrentProfile} getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} username={props.username} profilePic={props.profilePic} tweets={props.tweets} setTweets={props.setTweets} interaction={props.interaction} setInteraction={props.setInteraction} currentUser={props.currentUser} setProfileView={props.setProfileView} />
            </div>
        </div>
    )
}

const ProfileInfo = (props) => {
    return (
        <div id='current-profile'>
            <div id='current-profile-info'>
                <img id='current-profile-pic' src={props.currentProfile.profilePic} alt='current-profile-pic' />
                <div id='current-profile-name'>{props.currentProfile.name}</div>
            </div>
        </div>
    )
}   

const ProfileNav = (props) => {
    return (
        <div id='profile-nav'>
            <div onClick={() => {props.setProfileView('tweets'); props.setInteraction(true)}} id='tweets-view'>Tweets</div>
            <div onClick={() => {props.setProfileView('likes'); props.setInteraction(true)}} id='likes-view'>Likes</div>
            <div onClick={() => {props.setProfileView('retweets'); props.setInteraction(true)}} id='retweets-view'>Retweets</div>
        </div>
    )
}