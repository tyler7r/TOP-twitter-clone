import React, { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export const DisplayTweets = (props) => {
    const like = async (e) => {
        const docRef = doc(db, 'tweets', e.target.id);
        await updateDoc(docRef, {
            likes: increment(1),
        })
        props.setInteraction(true);
    }

    const retweet = async (e) => {
        const docRef = doc(db, 'tweets', e.target.id);
        await updateDoc(docRef, {
            retweets: increment(1),
        })
        props.setInteraction(true);
    }

    return (
        <div id='feed'>
            {props.tweets.map(tweet => {
                return (
                    <div key={tweet.id} className='tweet'>
                        <img className='tweet-profilePic' src={tweet.profilePic} alt='tweet-profilePic' />
                        <div className='tweet-name'>{tweet.name}</div>
                        <div className='tweet-message'>{tweet.message}</div>
                        <div className='likes'>{tweet.likes}</div>
                        <div className='retweets'>{tweet.retweets}</div>
                        <div className='tweet-time'></div>
                        <div className='interact'>
                            <div onClick={(e) => like(e)} id={tweet.id} className='like-tweet'>LIKE</div>
                            <div onClick={(e) => retweet(e)} id={tweet.id} className='retweet-tweet'>RT</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
