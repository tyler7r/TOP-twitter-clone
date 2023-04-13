import React, { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { Comment } from '../Comments/Comment';
import { DisplayComments } from '../Comments/DisplayComments';
import Heart from '../../images/heart.svg';
import Retweet from '../../images/retweet.svg';
import CommentIcon from '../../images/comment.svg';
import '../../styles/tweet.css'

export const DisplayTweets = (props) => {
    const [commentMode, setCommentMode] = useState({open: false, id: ''});
    const [openTweet, setOpenTweet] = useState({open: false, id: ''});
    const [newComment, setNewComment] = useState(false);
    const [comments, setComments] = useState([])

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

    const comment = async (id) => {
        const docRef = doc(db, 'tweets', id);
        await updateDoc(docRef, {
            comments: increment(1),
        })
        props.setInteraction(true);
    }

    const getComments = async (e) => {
        console.log(openTweet.open);
        if (openTweet.open === false) {
            let copy = []
            const querySnapshot = await getDocs(collection(db, 'tweets', e.target.id, 'comments'));
            querySnapshot.forEach((doc) => {
                copy.push(doc.data())
            })
            setOpenTweet({open: true, id: `${e.target.id}`})
            if (copy.length === comments.length) return
            else setComments(copy);
        } else {
            setOpenTweet({open: false, id: ``});
        }
    }

    return (
        <div id='feed'>
            {props.tweets.map(tweet => {
                return (
                    <div key={tweet.id} className='tweet'>
                        <img className='tweet-profilePic' src={tweet.profilePic} alt='tweet-profilePic' />
                        <div id={tweet.id} className="tweet-details">
                            <div id={tweet.id} className='tweet-name' onClick={(e) => getComments(e)}>{tweet.name}</div>
                            <div id={tweet.id} className='tweet-message' onClick={(e) => getComments(e)}>{tweet.message}</div>
                            <div id={tweet.id} className="interaction-btns-container">
                                <div className="interaction-btns">
                                    <img className='tweet-interaction-btn' src={Heart} alt='like-btn' onClick={(e) => {if(props.checkSignIn()) like(e)}} id={tweet.id}/>
                                    <div className='likes'>{tweet.likes}</div>
                                </div>
                                <div className="interaction-btns">
                                    <img src={Retweet} alt='retweet-btn' onClick={(e) => {if(props.checkSignIn()) retweet(e)}} id={tweet.id} className='tweet-interaction-btn' />
                                    <div className='retweets'>{tweet.retweets}</div>
                                </div>
                                <div className="interaction-btns">
                                    <img src={CommentIcon} alt='comment-btn' onClick={() => {if(props.checkSignIn()) setCommentMode({open: (!commentMode.open), id: `${tweet.id}`})}} id={tweet.id} className='tweet-interaction-btn' />
                                    <div className='comments'>{tweet.comments}</div>
                                </div>
                            </div>
                        </div>
                        <Comment comments={comments} setComments={setComments} newComment={newComment} setNewComment={setNewComment} openTweet={openTweet} setOpenTweet={setOpenTweet} comment={comment} username={props.username} profilePic={props.profilePic} commentMode={commentMode} setCommentMode={setCommentMode} tweetId={tweet.id} tweets={props.tweets} setTweets={props.setTweets} />
                        <DisplayComments comments={comments} setComments={setComments} newComment={newComment} setNewComment={setNewComment} openTweet={openTweet} tweetId={tweet.id} />
                    </div>
                )
            })}
        </div>
    )
}
