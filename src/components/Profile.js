import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { WriteTweet } from './Tweets/WriteTweet';
import { DisplayTweets } from './Tweets/DisplayTweets';

export const Profile = (props) => {
    const [draftMode, setDraftMode] = useState(false)

    return (
        <div id='profile'>
            <div id='home-page'>
                <Header setCurrentProfile={props.setCurrentProfile} setInteraction={props.setInteraction} signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
                <ProfileNav profileView={props.profileView} setProfileView={props.setProfileView} setInteraction={props.setInteraction} />
                <WriteTweet draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={props.currentProfile} setCurrentProfile={props.setCurrentProfile} getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} tweets={props.tweets} setTweets={props.setTweets} profilePic={props.profilePic} username={props.username} setInteraction={props.setInteraction}/>
                <DisplayTweets draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={props.currentProfile} setCurrentProfile={props.setCurrentProfile} getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} username={props.username} profilePic={props.profilePic} tweets={props.tweets} setTweets={props.setTweets} interaction={props.interaction} setInteraction={props.setInteraction} currentUser={props.currentUser} setProfileView={props.setProfileView} />
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