import React, { useState } from 'react';
import { db } from '../../firebase';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

export const WriteTweet = (props) => {
    const { tweets, uid, username, profilePic, setTweets, setInteraction, setDraftMode, draftMode, checkSignIn } = props 
    const [tweet, setTweet] = useState('');

    const submitTweet = async (e, message) => {
        let copy = [...tweets];
        e.preventDefault();
        try {
            const newTweet = await addDoc(collection(db, 'tweets'), {
                author: uid(),
                name: username(),
                message: message,
                time: serverTimestamp(),
                profilePic: profilePic(),
                likes: [],
                retweets: [],
                comments: 0,
            })
            await updateDoc(doc(db, 'tweets', newTweet.id), {
                id: newTweet.id,
            })
            setTweets(copy);
        } catch (error) {
            console.error("Error with message: ", error);
        }
        setInteraction(true);
        setDraftMode(false);
        setTweet('');
    }

    if (draftMode === false) {
        return <div id='tweet-button' onClick={() => {if (checkSignIn() === true){setDraftMode(true)}}}>Tweet</div>
    } else if (draftMode === true) {
        return (
            <TweetDraft draftMode={draftMode} setDraftMode={setDraftMode} tweet={tweet} setTweet={setTweet} submitTweet={submitTweet} />
        )
    }
}

const TweetDraft = (props) => {
    const { tweet, setTweet, submitTweet } = props
    return (
        <div id='tweet-draft'>
            <input value={tweet} type='text' name='tweet-text' id='tweet-text' placeholder="What's on your mind?" onChange={(e) => {setTweet(e.target.value)}} maxLength={160} />
            <button onClick={(e) => {submitTweet(e, tweet)}} type='submit' id='submit-tweet'>Tweet</button>
        </div>
    )
}