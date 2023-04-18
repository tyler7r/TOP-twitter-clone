import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase';
import { Comment } from '../Comments/Comment';
import { DisplayComments } from '../Comments/DisplayComments';
import Heart from '../../images/heart.svg';
import Retweet from '../../images/retweet.svg';
import CommentIcon from '../../images/comment.svg';
import '../../styles/tweet.css'

export const DisplayTweets = (props) => {
    const { tweets, setInteraction, currentUser, setCurrentProfile, setSearch, setSearchMode, setProfileView, checkSignIn, username, setTweets, uid } = props;

    const [commentMode, setCommentMode] = useState({open: false, id: ''});
    const [openTweet, setOpenTweet] = useState({open: false, id: ''});
    const [newComment, setNewComment] = useState(false);
    const [comments, setComments] = useState([]);

    const like = async (e) => {
        if (checkSignIn()) {
            const tweet = doc(db, 'tweets', e.target.id);
            const snapshot = await getDoc(tweet);
            const likes = snapshot.data().likes

            if (likes.includes(currentUser)) {
                await updateDoc(tweet, {
                    likes: arrayRemove(currentUser)
                })
            } else {
                await updateDoc(tweet, {
                    likes: arrayUnion(currentUser),
                })
            }
            setInteraction(true);
        }
    }

    const retweet = async (e) => {
        if (checkSignIn()) {
            const docRef = doc(db, 'tweets', e.target.id);
            const snapshot = await getDoc(docRef);
            const retweets = snapshot.data().retweets;

            if (retweets.includes(currentUser)) {
                await updateDoc(docRef, {
                    retweets: arrayRemove(currentUser)
                })
            } else {
                await updateDoc(docRef, {
                    retweets: arrayUnion(currentUser),
                })
            }
            setInteraction(true);
        }
    }

    const comment = async (id) => {
        const docRef = doc(db, 'tweets', id);
        const colRef = collection(db, 'tweets', id, 'comments');
        const snapshot = (await getCountFromServer(colRef)).data().count;
        await updateDoc(docRef, {
            comments: snapshot,
        })
        setInteraction(true);
    }

    const getComments = async (id) => {
        if (openTweet.open === false) {
            let copy = []
            const querySnapshot = await getDocs(collection(db, 'tweets', id, 'comments'));
            querySnapshot.forEach((doc) => {
                copy.push(doc.data())
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
        })
        setComments(copy);
    }

    const checkCommentInteractionStatus = async (id) => {
        for (let i = 0; i < comments.length; i++) {
            let cmt = await getDoc(doc(db, 'tweets', id, 'comments', comments[i].id))
            let like = document.querySelector(`#cmt${comments[i].id}`);
            if (cmt.data() === undefined) continue
            if (like === null) continue
            if (cmt.data().likes.includes(currentUser)) {
                like.classList.add('liked')
            } else {
                like.classList.remove('liked');
            }
        }
    }

    const deleteTweet = async (e) => {
        if (checkSignIn()) {
            const getTweet = await getDoc(doc(db, 'tweets', e.target.id));
            if (getTweet.data().author === currentUser) {
                await deleteDoc(doc(db, 'tweets', e.target.id))
            }
            setInteraction(true);
        }
    }

    if (tweets.length === 0) {
        return <div id='no-tweets-msg'>No Tweets</div>
    } else {
        return (
            <div id='feed'>
                {tweets.map(tweet => {
                    if (tweet.author === currentUser) {
                        return (
                            <div key={tweet.id} className='tweet'>
                                <Link className='profile-pic-link' to='/profile'><img onClick={() => {setInteraction(true); setCurrentProfile({author: tweet.author, name: tweet.name, profilePic: tweet.profilePic }); setProfileView('tweets'); setSearch(''); setSearchMode(false)}} className='tweet-profilePic' src={tweet.profilePic} alt='tweet-profilePic' /></Link>
                                <div id={tweet.id} className="tweet-details">
                                    <div id={tweet.id} className='tweet-name' onClick={() => getComments(tweet.id)}>{tweet.name}</div>
                                    <div id={tweet.id} className='tweet-message' onClick={() => {getComments(tweet.id); checkCommentInteractionStatus(tweet.id)}}>{tweet.message}</div>
                                    <div id={tweet.id} className="interaction-btns-container">
                                        <div className="interaction-btns">
                                            <img className='tweet-interaction-btn like-btn' src={Heart} alt='like-btn' onClick={(e) => like(e)} id={tweet.id}/>
                                            <div className='likes'>{tweet.likes.length}</div>
                                        </div>
                                        <div className="interaction-btns">
                                            <img src={Retweet} alt='retweet-btn' onClick={(e) => retweet(e)} id={tweet.id} className='tweet-interaction-btn retweet-btn' />
                                            <div className='retweets'>{tweet.retweets.length}</div>
                                        </div>
                                        <div className="interaction-btns">
                                            <img src={CommentIcon} alt='comment-btn' onClick={() => {if(checkSignIn()) setCommentMode({open: (!commentMode.open), id: `${tweet.id}`})}} id={tweet.id} className='tweet-interaction-btn comment-btn' />
                                            <div className='comments'>{tweet.comments}</div>
                                        </div>
                                        <div id={tweet.id} onClick={(e) => deleteTweet(e)} className='interaction-btns tweet-delete'>Delete</div>
                                    </div>
                                    <div id={tweet.id} className='tweet-time'>{tweet.time.toDate().toLocaleDateString('en-US')} {tweet.time.toDate().toLocaleTimeString('en-US')}</div>
                                </div>
                                <Comment retrieveComments={retrieveComments} setNewComment={setNewComment} comment={comment} username={username} commentMode={commentMode} setCommentMode={setCommentMode} tweetId={tweet.id} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} uid={uid} />
                                <DisplayComments checkLike={checkCommentInteractionStatus} currentUser={currentUser} retrieveComments={retrieveComments} checkSignIn={checkSignIn} comments={comments} openTweet={openTweet} tweetId={tweet.id} uid={uid} comment={comment} />
                            </div>
                        )
                    } else {
                    return (
                        <div key={tweet.id} className='tweet'>
                            <Link to='/profile'><img onClick={() => {setInteraction(true); setCurrentProfile({author: tweet.author, name: tweet.name, profilePic: tweet.profilePic}); setProfileView('tweets'); setSearch(''); setSearchMode(false)}} className='tweet-profilePic' src={tweet.profilePic} alt='tweet-profilePic' /></Link>
                            <div id={tweet.id} className="tweet-details">
                                <div id={tweet.id} className='tweet-name' onClick={() => getComments(tweet.id)}>{tweet.name}</div>
                                <div id={tweet.id} className='tweet-message' onClick={() => {getComments(tweet.id); checkCommentInteractionStatus(tweet.id)}}>{tweet.message}</div>
                                <div id={tweet.id} className="interaction-btns-container">
                                    <div className="interaction-btns">
                                        <img className='tweet-interaction-btn like-btn' src={Heart} alt='like-btn' onClick={(e) => like(e)} id={tweet.id}/>
                                        <div className='likes'>{tweet.likes.length}</div>
                                    </div>
                                    <div className="interaction-btns">
                                        <img src={Retweet} alt='retweet-btn' onClick={(e) => retweet(e)} id={tweet.id} className='tweet-interaction-btn retweet-btn' />
                                        <div className='retweets'>{tweet.retweets.length}</div>
                                    </div>
                                    <div className="interaction-btns">
                                        <img src={CommentIcon} alt='comment-btn' onClick={() => {if(checkSignIn()) setCommentMode({open: (!commentMode.open), id: `${tweet.id}`})}} id={tweet.id} className='tweet-interaction-btn' />
                                        <div className='comments'>{tweet.comments}</div>
                                    </div>
                                </div>
                                <div id={tweet.id} className='tweet-time'>{tweet.time.toDate().toLocaleDateString('en-US')} {tweet.time.toDate().toLocaleTimeString('en-US')}</div>
                            </div>
                            <Comment retrieveComments={retrieveComments} setNewComment={setNewComment} comment={comment} username={username} commentMode={commentMode} setCommentMode={setCommentMode} tweetId={tweet.id} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} uid={uid} />
                            <DisplayComments checkLike={checkCommentInteractionStatus} currentUser={currentUser} retrieveComments={retrieveComments} checkSignIn={checkSignIn} comments={comments} openTweet={openTweet} tweetId={tweet.id} uid={uid} comment={comment} />
                        </div>
                    )
                    }
                })}
            </div>
        )
    }
}
