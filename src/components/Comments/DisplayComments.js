import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { getDocs, collection, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'
import Heart from '../../images/heart.svg'
import '../../styles/tweet.css'

export const DisplayComments = (props) => {
    const retrieveComments = async () => {
        let copy = [];
        const querySnapshot = await getDocs(collection(db, 'tweets', props.tweetId, 'comments'));
        querySnapshot.forEach((doc) => {
            copy.push(doc.data())
            copy[copy.length - 1].id = doc.id;
        })
        props.setComments(copy);
    }

    const like = async (e) => {
        const docRef = doc(db, 'tweets', props.tweetId, 'comments', e.target.id);
        const snapshot = await getDoc(docRef);
        const likes = snapshot.data().likes
        if (likes.includes(props.uid())) {
            await updateDoc(docRef, {
                likes: arrayRemove(props.uid())
            })
        } else {
            await updateDoc(docRef, {
                likes: arrayUnion(props.uid()),
            })
        }
        retrieveComments();
    }

    if (props.openTweet.open === true && props.openTweet.id === props.tweetId) {
        return (
            <div className='comment-section'>
                {props.comments.map(comment => {
                    return (
                        <div key={Math.random()} className='comment'>
                            <div className='comment-message'>{comment.message}</div>
                            <div className='comment-interaction-container'>
                                <img id={comment.id} onClick={(e) => {if(props.checkSignIn()) like(e)}} className='comment-interaction-btn' src={Heart} alt='like-icon' />
                                <div className='comment-likes'>{comment.likes.length}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}