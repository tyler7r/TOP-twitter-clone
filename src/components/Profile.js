import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { WriteTweet } from './Tweets/WriteTweet';
import { DisplayTweets } from './Tweets/DisplayTweets';

export const Profile = (props) => {

    return (
        <div id='profile'>
            <div id='home-page'>
                <Header signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
                <Link to='/'>Back Home</Link>
                <WriteTweet getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} tweets={props.tweets} setTweets={props.setTweets} profilePic={props.profilePic} username={props.username}/>
                <DisplayTweets getUserInteractions={props.getUserInteractions} uid={props.uid} checkSignIn={props.checkSignIn} username={props.username} profilePic={props.profilePic} tweets={props.tweets} setTweets={props.setTweets} interaction={props.interaction} setInteraction={props.setInteraction} />
            </div>
        </div>
    )
}