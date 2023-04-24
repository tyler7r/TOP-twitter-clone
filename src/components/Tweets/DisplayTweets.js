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
    const { setDraftMode, currentProfile, tweets, setInteraction, currentUser, setCurrentProfile, setSearch, setSearchMode, setProfileView, checkSignIn, username, setTweets, uid } = props;

    const [commentMode, setCommentMode] = useState({open: false, id: ''});
    const [openTweet, setOpenTweet] = useState({open: false, id: ''});
    const [newComment, setNewComment] = useState(false);
    const [comments, setComments] = useState([]);

    const like = async (e) => {
        if (checkSignIn()) {
            let btnId = e.target.id.slice(2)
            const tweet = doc(db, 'tweets', btnId);
            const snapshot = await getDoc(tweet);
            const likes = snapshot.data().likes

            if (likes.includes(currentUser.id)) {
                await updateDoc(tweet, {
                    likes: arrayRemove(currentUser.id)
                })
            } else {
                await updateDoc(tweet, {
                    likes: arrayUnion(currentUser.id),
                })
            }
            setInteraction(true);
        }
    }

    const retweet = async (e) => {
        if (checkSignIn()) {
            let btnId = e.target.id.slice(2)
            const docRef = doc(db, 'tweets', btnId);
            const snapshot = await getDoc(docRef);
            const retweets = snapshot.data().retweets;

            if (retweets.includes(currentUser.id)) {
                await updateDoc(docRef, {
                    retweets: arrayRemove(currentUser.id)
                })
            } else {
                await updateDoc(docRef, {
                    retweets: arrayUnion(currentUser.id),
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

    const updateComments = async (comment, id) => {
        const getUser = await getDoc(doc(db, 'users', comment.data().author))
        await updateDoc(doc(db, 'tweets', id, 'comments', comment.data().id), {
            profilePic: getUser.data().profilePic,
        })
    }

    const getComments = async (id) => {
        if (commentMode.open === true) {
            setCommentMode({open: false, id: ''})
        }
        if (openTweet.open === false) {
            let copy = []
            const querySnapshot = await getDocs(collection(db, 'tweets', id, 'comments'));
            querySnapshot.forEach((doc) => {
                updateComments(doc, id)
                copy.push(doc.data())
            })
            setOpenTweet({open: true, id: `${id}`})
            setComments(copy);
        } else {
            setOpenTweet({open: false, id: ``});
        }
    }

    const retrieveComments = async (id) => {
        let copy = [];
        const querySnapshot = await getDocs(collection(db, 'tweets', id, 'comments'));
        querySnapshot.forEach((doc) => {
            updateComments(doc, id)
            copy.push(doc.data())
        })
        setComments(copy);
    }

    const checkCommentInteractionStatus = async (id) => {
        if (comments.length === 0) return
        for (let i = 0; i < comments.length; i++) {
            let cmt = await getDoc(doc(db, 'tweets', id, 'comments', comments[i].id))
            let like = document.querySelector(`#cmt${comments[i].id}`);
            if (cmt.data() === undefined) continue
            if (like === null) continue
            if (cmt.data().likes.includes(currentUser.id)) {
                like.classList.add('liked')
            } else {
                like.classList.remove('liked');
            }
        }
    }

    const deleteTweet = async (e) => {
        if (checkSignIn()) {
            const getTweet = await getDoc(doc(db, 'tweets', e.target.id));
            if (getTweet.data().author === currentUser.id) {
                await deleteDoc(doc(db, 'tweets', e.target.id))
            }
            setInteraction(true);
        }
    }

    const toggleTweetHover = (e) => {
        const tweet = document.querySelector(`.tweet#${e.target.id}`);
        tweet.classList.toggle('hovered');
    }

    if (tweets.length === 0) {
        return <div id='no-tweets-msg'>No Tweets</div>
    } else {
        return (
            <div id='feed'>
                {tweets.map(tweet => {
                    return (
                        <div key={tweet.id} className='tweet' id={`twt${tweet.id}`}>
                            <Link className='profile-pic-link' to={'/profile/' + tweet.author}><img onClick={() => {setInteraction(true); setProfileView('tweets')}} className='tweet-profilePic' src={tweet.profilePic} alt='tweet-profilePic' /></Link>
                            <div className="tweet-details">
                                <Link to={'/profile/' + tweet.author} className='tweet-name'><div id={tweet.id} onClick={() => {setInteraction(true)}}>{tweet.name}</div></Link>
                                <div id={`twt${tweet.id}`} onMouseEnter={(e) => toggleTweetHover(e)} onMouseLeave={(e) => toggleTweetHover(e)} className='tweet-message' onClick={() => {getComments(tweet.id); checkCommentInteractionStatus(tweet.id); setDraftMode(false)}}>{tweet.message}</div>
                                <div id={`twt${tweet.id}`} className="interaction-btns-container">
                                    <div className="interaction-btns">
                                        <img src={CommentIcon} alt='comment-btn' onClick={() => {if(checkSignIn()) setCommentMode({open: (!commentMode.open), id: `${tweet.id}`}); setDraftMode(false)}} id={tweet.id} className='tweet-interaction-btn comment-btn' />
                                        <div className='comments'>{tweet.comments}</div>
                                    </div>
                                    <div className="interaction-btns">
                                        <img src={Retweet} alt='retweet-btn' onClick={(e) => retweet(e)} id={`id${tweet.id}`} className='tweet-interaction-btn retweet-btn' />
                                        <div className='retweets'>{tweet.retweets.length}</div>
                                    </div>
                                    <div className="interaction-btns">
                                        <img className='tweet-interaction-btn like-btn' src={Heart} alt='like-btn' onClick={(e) => like(e)} id={`id${tweet.id}`}/>
                                        <div className='likes'>{tweet.likes.length}</div>
                                    </div>
                                    {tweet.author === currentUser.id && (
                                        <div id={tweet.id} onClick={(e) => deleteTweet(e)} className='interaction-btns tweet-delete'>DELETE</div>
                                    )}
                                </div>
                                <div id={tweet.id} className='tweet-time'>
                                    <div className="tweet-date">{tweet.time.toDate().toLocaleDateString('en-US')}</div>
                                    <div className="tweet-time-details">{tweet.time.toDate().toLocaleTimeString(navigator.language, {hour: '2-digit', minute: '2-digit'})}</div>
                                </div>
                            </div>
                            <Comment retrieveComments={retrieveComments} setNewComment={setNewComment} comment={comment} username={username} commentMode={commentMode} setCommentMode={setCommentMode} tweetId={tweet.id} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} uid={uid} currentUser={currentUser} />
                            <DisplayComments checkLike={checkCommentInteractionStatus} currentUser={currentUser} retrieveComments={retrieveComments} checkSignIn={checkSignIn} comments={comments} openTweet={openTweet} tweetId={tweet.id} uid={uid} comment={comment} setInteraction={setInteraction} setCurrentProfile={setCurrentProfile} setSearchMode={setSearchMode} setSearch={setSearch} setProfileView={setProfileView} />
                        </div>
                    )
                })}
            </div>
        )
    }
}
