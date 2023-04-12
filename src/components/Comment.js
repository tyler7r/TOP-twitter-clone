import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const CommentDraft = (props) => {
    return (
        <div id='tweet-draft'>
            <input value={props.comment} type='text' name='comment-text' id='comment-text' placeholder="What's your response" onChange={(e) => {props.setComment(e.target.value)}} />
            <button onClick={(e) => {props.submitComment(e, props.comment)}} type='submit' id='submit-comment'>Submit</button>
        </div>
    )
}

export const Comment = (props) => {
    const [comment, setComment] = useState('');

    const submitComment = async (e, message) => {
        let copy = [...props.tweets];
        e.preventDefault();
        try {
            await addDoc(collection(db, 'tweets', props.tweetId, 'comments'), {
                name: props.username(),
                message: message,
                time: serverTimestamp(),
                profilePic: props.profilePic(),
                likes: 0,
                retweets: 0,
            })
            props.setTweets(copy);
        } catch (error) {
            console.error("Error with message: ", error);
        }
        setComment('');
        props.comment(props.tweetId);
        props.setCommentMode(false);
        
    }
    if (props.commentMode === true) {
        return (
            <CommentDraft commentNum={props.comment} commentMode={props.draftMode} setCommentMode={props.setDraftMode} comment={comment} setComment={setComment} submitComment={submitComment} />
        )
    }
}