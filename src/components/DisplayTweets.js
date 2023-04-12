import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const DisplayTweets = (props) => {
    // const [tweets, setTweets] = useState([]);

    // useEffect(() => {
    //     let copy = [];
    //     const getTweets = async () => {
    //         const querySnapshot = await getDocs(collection(db, 'tweets'))
    //         querySnapshot.forEach((doc) => {
    //             copy.push(doc.data())
    //         })
    //         setTweets(copy);
    //     }
    //     getTweets();
    // }, [])

    return (
        <div id='feed'>
            {props.tweets.map(tweet => {
                return (
                    <div key={tweet.id} className='tweet'>
                        <img className='tweet-profilePic' src={tweet.profilePic} alt='tweet-profilePic' />
                        <div className='tweet-name'>{tweet.name}</div>
                        <div className='tweet-message'>{tweet.message}</div>
                        <div className='tweet-time'></div>
                    </div>
                )
            })}
        </div>
    )
}
