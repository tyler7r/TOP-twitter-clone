import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const CommentDraft = (props) => {
    return (
        <div id='tweet-draft'>
            <input value={props.comment} type='text' name='comment-text' id='comment-text' placeholder="What's your response" onChange={(e) => {props.setComment(e.target.value)}} />
            <button onClick={(e) => {props.submitComment(e, props.comment)}} type='submit' id='submit-comment'>Submit</button>
        </div>
    )
}

export const Comment = (props) => {
    const { comments, setComments, newComment, setNewComment, tweetId } = props
    const [comment, setComment] = useState('');

    useEffect(() => {
        let copy = [];
        const getComments = async (e) => {
            const querySnapshot = await getDocs(collection(db, 'tweets', tweetId, 'comments'));
            querySnapshot.forEach((doc) => {
                copy.push(doc.data())
            })
            if (copy.length === comments.length && newComment === false) return
            else setComments(copy);
            setNewComment(false);
        }
        getComments();
        console.log(comments);
    }, [comments, newComment]);

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
        props.setNewComment(true);
        props.comment(props.tweetId);
        props.setCommentMode(false);
        
    }
    if (props.commentMode === true) {
        return (
            <CommentDraft commentNum={props.comment} commentMode={props.draftMode} setCommentMode={props.setDraftMode} comment={comment} setComment={setComment} submitComment={submitComment} comments={comments} />
        )
    }
}