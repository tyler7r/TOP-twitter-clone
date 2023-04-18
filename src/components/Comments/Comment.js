import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

export const Comment = (props) => {
    const { uid, username, tweetId, tweets, profilePic, setTweets, setNewComment, comment, commentMode, setCommentMode, setInteraction, retrieveComments} = props
    const [commentMsg, setCommentMsg] = useState('');

    const submitComment = async (e, message) => {
        let copy = [...tweets];
        e.preventDefault();
        try {
            const newComment = await addDoc(collection(db, 'tweets', tweetId, 'comments'), {
                author: uid(),
                name: username(),
                message: message,
                time: serverTimestamp(),
                profilePic: profilePic(),
                likes: [],
            })
            await updateDoc(doc(db, 'tweets', tweetId, 'comments', newComment.id), {
                id: newComment.id
            })
            setTweets(copy);
        } catch (error) {
            console.error("Error with message: ", error);
        }
        setCommentMsg('');
        setNewComment(true);
        comment(tweetId);
        setCommentMode({open: false, id: ''});
        setInteraction(true);
        retrieveComments(tweetId);
    }

    if (commentMode.open === true && commentMode.id === tweetId) {
        return (
            <CommentDraft commentMsg={commentMsg} setCommentMsg={setCommentMsg} submitComment={submitComment} />
        )
    }
}

const CommentDraft = (props) => {
    const { commentMsg, submitComment, setCommentMsg } = props
    return (
        <div id='tweet-draft'>
            <input value={commentMsg} type='text' name='comment-text' id='comment-text' placeholder="What's your response" onChange={(e) => {setCommentMsg(e.target.value)}} />
            <button onClick={(e) => {submitComment(e, commentMsg)}} type='submit' id='submit-comment'>Submit</button>
        </div>
    )
}