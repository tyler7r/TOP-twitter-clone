import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from './Header';
import { DisplayTweets } from './Tweets/DisplayTweets';
import { getDoc, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/profile.css'

export const Profile = (props) => {
    const { id } = useParams();

    const { userUpdate, setUserUpdate, setCurrentProfile, setSearchMode, setSearch, signIn, logOut, isUserSignedIn, profilePic, username, setProfileView, setInteraction, currentProfile, profileView, uid, checkSignIn, currentUser, tweets, setTweets, interaction, setHomeView } = props;

    useEffect(() => {
        const getProfile = async () => {
            const getUser = await getDoc(doc(db, 'users', id))
            console.log(getUser.data());
            setCurrentProfile(getUser.data());
        }
        getProfile();
        getProfileInfo();
    }, [])

    const [draftMode, setDraftMode] = useState(false);
    const [followCount, setFollowCount] = useState({})
    const [editMode, setEditMode] = useState(false);
    const [profileBio, setProfileBio] = useState('');
    const [bioPic, setBioPic] = useState('');
    const [profileImg, setProfileImg] = useState('');

    const getProfileInfo = async () => {
        const getUser = await getDoc(doc(db, 'users', id))
        const bio = getUser.data().bio;
        const getBioPic = getUser.data().bioPic;
        const getProfilePic = getUser.data().profilePic;
        const followers = getUser.data().followers;
        const following = getUser.data().following;
        setFollowCount({ followers: followers.length, following: following.length})
        setProfileBio(bio);
        setBioPic(getBioPic);
        setProfileImg(getProfilePic);
    }

    useEffect(() => {
        if (interaction === true) {
            setHomeView('all');
            setSearchMode(false);
            setSearch('');
            getProfileInfo()
        }
    }, [interaction, userUpdate])

    const follow = async () => {
        if (checkSignIn()) {
            const followingUser = doc(db, 'users', currentUser.id)
            const followedUser = doc(db, 'users', currentProfile.id);
            const followingSnapshot = await getDoc(followingUser);
            
            const following = followingSnapshot.data().following;

            if (following.some(e => e.id === currentProfile.id)) {
                await updateDoc(followingUser, {
                    following: arrayRemove({id: currentProfile.id, name: currentProfile.name})
                })
                await updateDoc(followedUser, {
                    followers: arrayRemove({id: currentUser.id, name: username()})
                })
            } else if (!following.some(e => e.id === currentProfile.id)) {
                await updateDoc(followingUser, {
                    following: arrayUnion({id: currentProfile.id, name: currentProfile.name})
                })
                await updateDoc(followedUser, {
                    followers: arrayUnion({id: currentUser.id, name: username()})
                })
            }
            setInteraction(true);
        }
    }

    return (
        <div id='profile'>
            <Header setSearch={setSearch} setSearchMode={setSearchMode} setCurrentProfile={setCurrentProfile} setInteraction={setInteraction} signIn={signIn} logOut={logOut} isUserSignedIn={isUserSignedIn} profilePic={profilePic} username={username} />
            <ProfileInfo profileImg={profileImg} setProfileImg={setProfileImg} bioPic={bioPic} setBioPic={setBioPic} profileBio={profileBio} setProfileBio={setProfileBio} currentProfile={currentProfile} currentUser={currentUser} follow={follow} followCount={followCount} editMode={editMode} setEditMode={setEditMode} setInteraction={setInteraction} profilePic={profilePic} setUserUpdate={setUserUpdate} />
            <ProfileNav profileView={profileView} setProfileView={setProfileView} setInteraction={setInteraction} />
            <DisplayTweets setSearchMode={setSearchMode} setSearch={setSearch} draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} uid={uid} checkSignIn={checkSignIn} username={username} profilePic={profilePic} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} currentUser={currentUser} setProfileView={setProfileView} />
        </div>
    )
}

const ProfileInfo = (props) => {
    const { profilePic, profileBio, setProfileBio, currentProfile, currentUser, follow, followCount, editMode, setEditMode, setInteraction, bioPic, setBioPic, profileImg, setProfileImg, setUserUpdate } = props
    
    const backgroundImage = {
        backgroundImage: `url(${bioPic})`
    }

    if (editMode === false && currentProfile.id === currentUser.id) {
        return (
            <div id='current-profile'>
                <div id='edit-profile-btn' onClick={() => setEditMode(true)}>Edit Profile</div>
                <div style={backgroundImage} id='current-profile-info'>
                    <img id='current-profile-pic' src={profileImg} alt='current-profile-pic' />
                    <div id='current-profile-name'>{currentProfile.name}</div>
                    <div id='profile-bio'>{profileBio}</div>
                </div>
                <FollowersSection follow={follow} followCount={followCount} currentProfile={currentProfile} currentUser={currentUser} />
            </div>
        )
    } else if (editMode === false && currentProfile.id !== currentUser.id) {
        return (
            <div id='current-profile'>
                <div style={backgroundImage} id='current-profile-info'>
                    <img id='current-profile-pic' src={profileImg} alt='current-profile-pic' />
                    <div id='current-profile-name'>{currentProfile.name}</div>
                    <div id='profile-bio'>{profileBio}</div>
                </div>
                <FollowersSection follow={follow} followCount={followCount} currentProfile={currentProfile} currentUser={currentUser} />
            </div>
        )
    } else if (editMode === true) {
        return (
            <div id='current-profile'>
                <div id='current-profile-info'>
                    <div id='current-profile-name'>{currentProfile.name}</div>
                </div>
                <FollowersSection follow={follow} followCount={followCount} currentProfile={currentProfile} currentUser={currentUser} />
                <EditProfile setUserUpdate={setUserUpdate} profilePic={profilePic} bioPic={bioPic} setBioPic={setBioPic} profileImg={profileImg} setProfileImg={setProfileImg} profileBio={profileBio} setProfileBio={setProfileBio} setEditMode={setEditMode} setInteraction={setInteraction} currentProfile={currentProfile} />
            </div>
        )
    }
}

const EditProfile = (props) => {
    const { profilePic, setEditMode, setInteraction, currentProfile, profileBio, setProfileBio, bioPic, setBioPic, profileImg, setProfileImg, setUserUpdate } = props

    const submitEdit = async (e) => {
        const profileImgSelector = document.querySelector(`#profile-pic`).files.length;
        const bioPicSelector = document.querySelector(`#background-img`).files.length
        const user = doc(db, 'users', currentProfile.id)
        if (bioPicSelector > 0) {
            await updateDoc(user, {
                bioPic: URL.createObjectURL(bioPic)
            })
        }
        if (profileImgSelector > 0) {
            await updateDoc(user, {
                profilePic: URL.createObjectURL(profileImg)
            })
        }
        await updateDoc(user, {
            bio: profileBio,
        })

        e.preventDefault();
        setUserUpdate(true);
        setInteraction(true);
        setEditMode(false);
    }

    const removeImage = async (icon) => {
        const user = doc(db, 'users', currentProfile.id)
        if (icon === 'background') {
            await updateDoc(user, {
                bioPic: '',
            })
        } else if (icon === 'profile') {
            await updateDoc(user, {
                profilePic: profilePic(),
            })
        }
    }

    return (
        <div id='profile-edit'>
            <div id='edit-profile-pic'>
                <label htmlFor='profile-pic'>Profile Pic: </label>
                <input type='file' id='profile-pic' name='profile-pic' onChange={(e) => setProfileImg(e.target.files[0])} />
                <div id='remove-profile-pic' onClick={() => removeImage('profile')}>REMOVE CURRENT IMG</div>
            </div>
            <div id='edit-background-img'>
                <label htmlFor='background-img'>Profile Background: </label>
                <input type='file' id='background-img' name='background-img' onChange={(e) => setBioPic(e.target.files[0])} />
                <div id='remove-background-img' onClick={() => removeImage('background')}>REMOVE CURRENT IMG</div>
            </div>
            <div id='bio-edit'>
                <label htmlFor='bio'>Bio: </label>
                <input type='text' name='bio' id='bio' placeholder='About you...' value={profileBio} maxLength={160} onChange={(e) => setProfileBio(e.target.value)} />
            </div>
            <div id='submit-profile-edit' type='submit' onClick={(e) => submitEdit(e)}>Done</div>
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

    if (currentProfile.id === currentUser.id) {
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