import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { DisplayTweets } from './Tweets/DisplayTweets';
import { getDoc, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

export const Profile = (props) => {
    const { setCurrentProfile, setSearchMode, setSearch, signIn, logOut, isUserSignedIn, profilePic, username, setProfileView, setInteraction, currentProfile, profileView, uid, checkSignIn, currentUser, tweets, setTweets, interaction } = props;

    const [draftMode, setDraftMode] = useState(false);
    const [followCount, setFollowCount] = useState({})

    const getFollowCounts = async () => {
        const getUser = await getDoc(doc(db, 'users', currentProfile.author))
        const followers = getUser.data().followers;
        const following = getUser.data().following;
        setFollowCount({ followers: followers.length, following: following.length})
    }

    useEffect(() => {
        if (interaction === true) {
            getFollowCounts()
        }
    }, [interaction])

    const follow = async () => {
        if (checkSignIn()) {
            const followingUser = doc(db, 'users', currentUser)
            const followedUser = doc(db, 'users', currentProfile.author);
            const followingSnapshot = await getDoc(followingUser);
            
            const following = followingSnapshot.data().following;

            if (following.includes(currentProfile.author)) {
                await updateDoc(followingUser, {
                    following: arrayRemove(currentProfile.author)
                })
                await updateDoc(followedUser, {
                    followers: arrayRemove(currentUser)
                })
            } else if (!following.includes(currentProfile.author)) {
                await updateDoc(followingUser, {
                    following: arrayUnion(currentProfile.author)
                })
                await updateDoc(followedUser, {
                    followers: arrayUnion(currentUser)
                })
            }
            setInteraction(true);
        }
    }

    return (
        <div id='profile'>
            <div id='home-page'>
                <Header setSearch={setSearch} setSearchMode={setSearchMode} setCurrentProfile={setCurrentProfile} setInteraction={setInteraction} signIn={signIn} logOut={logOut} isUserSignedIn={isUserSignedIn} profilePic={profilePic} username={username} />
                <ProfileInfo currentProfile={currentProfile} currentUser={currentUser} follow={follow} followCount={followCount} />
                <ProfileNav profileView={profileView} setProfileView={setProfileView} setInteraction={setInteraction} />
                <DisplayTweets setSearchMode={setSearchMode} setSearch={setSearch} draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} uid={uid} checkSignIn={checkSignIn} username={username} profilePic={profilePic} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} currentUser={currentUser} setProfileView={setProfileView} />
            </div>
        </div>
    )
}

const ProfileInfo = (props) => {
    const { currentProfile, currentUser, follow, followCount } = props
    
    return (
        <div id='current-profile'>
            <div id='current-profile-info'>
                <img id='current-profile-pic' src={currentProfile.profilePic} alt='current-profile-pic' />
                <div id='current-profile-name'>{currentProfile.name}</div>
            </div>
            <FollowersSection follow={follow} followCount={followCount} currentProfile={currentProfile} currentUser={currentUser} />
        </div>
    )
} 

const ProfileNav = (props) => {
    const { setProfileView, setInteraction } = props;

    return (
        <div id='profile-nav'>
            <div onClick={() => {setProfileView('tweets'); setInteraction(true)}} id='tweets-view'>Tweets</div>
            <div onClick={() => {setProfileView('likes'); setInteraction(true)}} id='likes-view'>Likes</div>
            <div onClick={() => {setProfileView('retweets'); setInteraction(true)}} id='retweets-view'>Retweets</div>
        </div>
    )
}

const FollowersSection = (props) => {
    const { currentProfile, currentUser, follow, followCount } = props;

    if (currentProfile.author === currentUser) {
        return (
            <div id="followers-section">
                <div id='followers-info'>
                    <div id='followers'>Followers: {followCount.followers}</div>
                    <div id='following'>Following: {followCount.following}</div>
                </div>
            </div>
        )
    } else {
        return (
        <div id='followers-section'>
            <div id='follow-btn' onClick={() => follow()}>FOLLOW</div>
            <div id='followers-info'>
                <div id='followers'>Followers: {followCount.followers}</div>
                <div id='following'>Following: {followCount.following}</div>
            </div>
        </div>
        )
    }
}