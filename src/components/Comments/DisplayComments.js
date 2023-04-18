import React, { useEffect } from "react";
import { db } from "../../firebase";
import { deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'
import Heart from '../../images/heart.svg'
import '../../styles/tweet.css'

export const DisplayComments = (props) => {
    const { checkLike, tweetId, comments, openTweet, uid, retrieveComments, comment, currentUser, checkSignIn } = props

    useEffect(() => {
        checkLike(tweetId);
    }, [comments, openTweet, tweetId, checkLike])

    const like = async (e) => {
        const cmtId = e.target.id.slice(3);
        const docRef = doc(db, 'tweets', tweetId, 'comments', cmtId);
        const snapshot = await getDoc(docRef);
        const likes = snapshot.data().likes
        if (likes.includes(uid())) {
            await updateDoc(docRef, {
                likes: arrayRemove(uid())
            })
        } else {
            await updateDoc(docRef, {
                likes: arrayUnion(uid()),
            })
        }
        retrieveComments(tweetId);
    }

    const deleteComment = async (e) => {
        const getComment = await getDoc(doc(db, 'tweets', tweetId, 'comments', e.target.id));
        if (getComment.data().author === uid()) {
            await deleteDoc(doc(db, 'tweets', tweetId, 'comments', e.target.id))
        }
        comment(tweetId);
        retrieveComments(tweetId);
    }

    if (openTweet.open === true && openTweet.id === tweetId) {
        return (
            <div className='comment-section'>
                {comments.map(comment => {
                    if (comment.author === currentUser) {
                        return (
                            <div key={Math.random()} className='comment'>
                                <div className='comment-message'>{comment.message}</div>
                                <div className='comment-interaction-container'>
                                    <img id={`cmt${comment.id}`} onClick={(e) => {if(checkSignIn()) {like(e)}}} className={`comment-interaction-btn comment-like`} src={Heart} alt='like-icon' />
                                    <div className='comment-likes'>{comment.likes.length}</div>
                                    <div id={comment.id} onClick={(e) => {if(checkSignIn()) deleteComment(e)}} className='comment-delete'>Delete</div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div key={Math.random()} className='comment'>
                                <div className='comment-message'>{comment.message}</div>
                                <div className='comment-interaction-container'>
                                    <img id={`cmt${comment.id}`} onClick={(e) => {if(checkSignIn()) {like(e)}}} className={`comment-interaction-btn comment-like`} src={Heart} alt='like-icon' />
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