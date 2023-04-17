import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { WriteTweet } from './Tweets/WriteTweet';
import { DisplayTweets } from './Tweets/DisplayTweets';
import { Search } from './Search';
import '../styles/feed.css'

export const Home = (props) => {
    useEffect(() => {
        // console.log(props.tweets);
    })
    const [draftMode, setDraftMode] = useState(false);
    
    return (
        <div id='home-page'>
            <Header setSearch={props.setSearch} setSearchMode={props.setSearchMode} setCurrentProfile={props.setCurrentProfile} setInteraction={props.setInteraction} signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
            <Search setInteraction={props.setInteraction} setSearchMode={props.setSearchMode} search={props.search} setSearch={props.setSearch} />
            <WriteTweet currentProfile={props.currentProfile} setCurrentProfile={props.setCurrentProfile} getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} tweets={props.tweets} setTweets={props.setTweets} draftMode={draftMode} setDraftMode={setDraftMode} profilePic={props.profilePic} username={props.username}  setInteraction={props.setInteraction}/>
            <DisplayTweets setSearchMode={props.setSearchMode} setSearch={props.setSearch} setProfileView={props.setProfileView} currentProfile={props.currentProfile} setCurrentProfile={props.setCurrentProfile} currentUser={props.currentUser} getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} username={props.username} profilePic={props.profilePic} tweets={props.tweets} setTweets={props.setTweets} interaction={props.interaction} setInteraction={props.setInteraction} />
        </div>
    )
}