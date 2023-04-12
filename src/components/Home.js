import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { WriteTweet } from './WriteTweet';
import { Feed } from './Feed';

export const Home = (props) => {
    const [draftMode, setDraftMode] = useState(false);

    if (props.isUserSignedIn === true) {
        return (
            <div id='home-page'>
                <Header signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
                <WriteTweet tweets={props.tweets} setTweets={props.setTweets} draftMode={draftMode} setDraftMode={setDraftMode} profilePic={props.profilePic} username={props.username}/>
                <Feed tweets={props.tweets} />
            </div>
        )
    } else {
        return (
            <div id='home-page'>
                <Header signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
                <Feed tweets={props.tweets} />
            </div>
        )
    }
}