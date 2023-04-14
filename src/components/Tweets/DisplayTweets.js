import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getDoc, doc, updateDoc, increment, arrayUnion, FieldValue, DocumentSnapshot, get, arrayRemove, getCountFromServer } from 'firebase/firestore';
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
    const [comments, setComments] = useState([]);

    const like = async (e) => {
        const tweet = doc(db, 'tweets', e.target.id);

        const snapshot = await getDoc(tweet);
        const likes = snapshot.data().likes
        if (likes.includes(props.uid())) {
            await updateDoc(tweet, {
                likes: arrayRemove(props.uid())
            })
        } else {
            await updateDoc(tweet, {
                likes: arrayUnion(props.uid()),
            })
        }
        props.getUserInteractions();
        props.setInteraction(true);
    }

    const retweet = async (e) => {
        const docRef = doc(db, 'tweets', e.target.id);
        const snapshot = await getDoc(docRef);
        const retweets = snapshot.data().retweets;
        if (retweets.includes(props.uid())) {
            await updateDoc(docRef, {
                retweets: arrayRemove(props.uid())
            })
        } else {
            await updateDoc(docRef, {
                retweets: arrayUnion(props.uid()),
            })
        }
        props.getUserInteractions();
        props.setInteraction(true);
    }

    const comment = async (id) => {
        const docRef = doc(db, 'tweets', id);
        const colRef = collection(db, 'tweets', id, 'comments');
        const snapshot = (await getCountFromServer(colRef)).data().count;
        await updateDoc(docRef, {
            comments: snapshot,
        })
        props.setInteraction(true);
    }

    const getComments = async (id) => {
        if (openTweet.open === false) {
            let copy = []
            const querySnapshot = await getDocs(collection(db, 'tweets', id, 'comments'));
            querySnapshot.forEach((doc) => {
                copy.push(doc.data())
                copy[copy.length - 1].id = doc.id;
            })
            setOpenTweet({open: true, id: `${id}`})
            if (copy.length === comments.length) return
            else setComments(copy);
        } else {
            setOpenTweet({open: false, id: ``});
        }
    }

    const retrieveComments = async (id) => {
        let copy = [];
        const querySnapshot = await getDocs(collection(db, 'tweets', id, 'comments'));
        querySnapshot.forEach((doc) => {
            copy.push(doc.data())
            copy[copy.length - 1].id = doc.id;
        })
        setComments(copy);
    }

    return (
        <div id='feed'>
            {props.tweets.map(tweet => {
                return (
                    <div key={tweet.id} className='tweet'>
                        <Link to='/profile'><img onClick={() => props.getUserInteractions()} className='tweet-profilePic' src={tweet.profilePic} alt='tweet-profilePic' /></Link>
                        <div id={tweet.id} className="tweet-details">
                            <div id={tweet.id} className='tweet-name' onClick={() => getComments(tweet.id)}>{tweet.name}</div>
                            <div id={tweet.id} className='tweet-message' onClick={() => getComments(tweet.id)}>{tweet.message}</div>
                            <div id={tweet.id} className="interaction-btns-container">
                                <div className="interaction-btns">
                                    <img className='tweet-interaction-btn' src={Heart} alt='like-btn' onClick={(e) => {if(props.checkSignIn()) like(e)}} id={tweet.id}/>
                                    <div className='likes'>{tweet.likes.length}</div>
                                </div>
                                <div className="interaction-btns">
                                    <img src={Retweet} alt='retweet-btn' onClick={(e) => {if(props.checkSignIn()) retweet(e)}} id={tweet.id} className='tweet-interaction-btn' />
                                    <div className='retweets'>{tweet.retweets.length}</div>
                                </div>
                                <div className="interaction-btns">
                                    <img src={CommentIcon} alt='comment-btn' onClick={() => {if(props.checkSignIn()) setCommentMode({open: (!commentMode.open), id: `${tweet.id}`})}} id={tweet.id} className='tweet-interaction-btn' />
                                    <div className='comments'>{tweet.comments}</div>
                                </div>
                            </div>
                        </div>
                        <Comment retrieveComments={retrieveComments} comments={comments} setComments={setComments} newComment={newComment} setNewComment={setNewComment} openTweet={openTweet} setOpenTweet={setOpenTweet} comment={comment} username={props.username} profilePic={props.profilePic} commentMode={commentMode} setCommentMode={setCommentMode} tweetId={tweet.id} tweets={props.tweets} setTweets={props.setTweets} setInteraction={props.setInteraction} uid={props.uid} />
                        <DisplayComments retrieveComments={retrieveComments} checkSignIn={props.checkSignIn} comments={comments} setComments={setComments} newComment={newComment} setNewComment={setNewComment} openTweet={openTweet} tweetId={tweet.id} uid={props.uid} setInteraction={props.setInteraction} getComments={getComments} comment={comment} />
                    </div>
                )
            })}
        </div>
    )
}
