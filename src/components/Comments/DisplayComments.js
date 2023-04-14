import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'
import Heart from '../../images/heart.svg'
import '../../styles/tweet.css'

export const DisplayComments = (props) => {

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
        props.retrieveComments(props.tweetId);
    }

    const deleteComment = async (e) => {
        const getComment = await getDoc(doc(db, 'tweets', props.tweetId, 'comments', e.target.id));
        if (getComment.data().author === props.uid()) {
            await deleteDoc(doc(db, 'tweets', props.tweetId, 'comments', e.target.id))
        }
        props.comment(props.tweetId);
        props.retrieveComments(props.tweetId);
    }

    if (props.openTweet.open === true && props.openTweet.id === props.tweetId) {
        return (
            <div className='comment-section'>
                {props.comments.map(comment => {
                    if (comment.author === props.currentUser) {
                        return (
                            <div key={Math.random()} className='comment'>
                                <div className='comment-message'>{comment.message}</div>
                                <div className='comment-interaction-container'>
                                    <img id={comment.id} onClick={(e) => {if(props.checkSignIn()) like(e)}} className='comment-interaction-btn' src={Heart} alt='like-icon' />
                                    <div className='comment-likes'>{comment.likes.length}</div>
                                    <div id={comment.id} onClick={(e) => {if(props.checkSignIn()) deleteComment(e)}} className='comment-delete'>Delete</div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div key={Math.random()} className='comment'>
                                <div className='comment-message'>{comment.message}</div>
                                <div className='comment-interaction-container'>
                                    <img id={comment.id} onClick={(e) => {if(props.checkSignIn()) like(e)}} className='comment-interaction-btn' src={Heart} alt='like-icon' />
                                    <div className='comment-likes'>{comment.likes.length}</div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        )
    }
}