import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { WriteTweet } from './Tweets/WriteTweet';
import { DisplayTweets } from './Tweets/DisplayTweets';

export const Profile = (props) => {
    const [draftMode, setDraftMode] = useState(false)

    useEffect(() => {
        console.log(props.currentUser)
    })

    return (
        <div id='profile'>
            <div id='home-page'>
                <Header signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
                <Link onClick={() => {props.setCurrentProfile(''); props.setInteraction(true)}}to='/'>Back Home</Link>
                <WriteTweet draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={props.currentProfile} setCurrentProfile={props.setCurrentProfile} getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} tweets={props.tweets} setTweets={props.setTweets} profilePic={props.profilePic} username={props.username} setInteraction={props.setInteraction}/>
                <DisplayTweets draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={props.currentProfile} setCurrentProfile={props.setCurrentProfile} getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} username={props.username} profilePic={props.profilePic} tweets={props.tweets} setTweets={props.setTweets} interaction={props.interaction} setInteraction={props.setInteraction} currentUser={props.currentUser} />
            </div>
        </div>
    )
}