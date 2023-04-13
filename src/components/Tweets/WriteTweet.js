import React, { useState } from 'react';
import { db } from '../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TweetDraft = (props) => {
    return (
        <div id='tweet-draft'>
            <input value={props.tweet} type='text' name='tweet-text' id='tweet-text' placeholder="What's on your mind?" onChange={(e) => {props.setTweet(e.target.value)}} />
            <button onClick={(e) => {props.submitTweet(e, props.tweet)}} type='submit' id='submit-tweet'>Tweet</button>
        </div>
    )
}

export const WriteTweet = (props) => {
    const [tweet, setTweet] = useState('');

    const submitTweet = async (e, message) => {
        let copy = [...props.tweets];
        e.preventDefault();
        try {
            await addDoc(collection(db, 'tweets'), {
                name: props.username(),
                message: message,
                time: serverTimestamp(),
                profilePic: props.profilePic(),
                likes: 0,
                retweets: 0,
                comments: 0,
            })
            props.setTweets(copy);
        } catch (error) {
            console.error("Error with message: ", error);
        }
        props.setDraftMode(false);
        setTweet('');
    }

    if (props.draftMode === false) {
        return <div id='tweet-button' onClick={() => {if (props.checkSignIn() === true){props.setDraftMode(true)}}}>Tweet</div>
    } else {
        return (
            <TweetDraft draftMode={props.draftMode} setDraftMode={props.setDraftMode} tweet={tweet} setTweet={setTweet} submitTweet={submitTweet} />
        )
    }
}