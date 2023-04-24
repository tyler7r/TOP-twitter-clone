import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from './Header';
import { DisplayTweets } from './Tweets/DisplayTweets';
import { getDoc, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import '../styles/profile.css'

export const Profile = (props) => {
    const { id } = useParams();

    const { setCurrentUser, userUpdate, setUserUpdate, setCurrentProfile, setSearchMode, setSearch, signIn, logOut, isUserSignedIn, profilePic, username, setProfileView, setInteraction, currentProfile, profileView, uid, checkSignIn, currentUser, tweets, setTweets, interaction, setHomeView } = props;

    const [draftMode, setDraftMode] = useState(false);
    const [followCount, setFollowCount] = useState({})
    const [editMode, setEditMode] = useState(false);
    const [profileBio, setProfileBio] = useState('');
    const [bioPic, setBioPic] = useState(null);
    const [profileImg, setProfileImg] = useState(null);

    const getProfile = async () => {
        const getUser = await getDoc(doc(db, 'users', id))
        setCurrentProfile({...getUser.data(), dateJoined: getUser.data().dateJoined.toDate().toLocaleDateString('en-US')});
    }

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
        getProfile();
        getProfileInfo();
        checkFollow();
    }, [])

    useEffect(() => {
        if (interaction === true) {
            setHomeView('all');
            setSearchMode(false);
            setSearch('');
            checkFollow();
            getProfile();
            getProfileInfo();
        }
    }, [interaction, userUpdate, currentProfile])

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
            checkFollow();
            setInteraction(true);
        }
    }

    const checkFollow = async () => {
        if (currentProfile.id === currentUser.id) return;
        const getUser = await getDoc(doc(db, 'users', currentUser.id));
        const following = getUser.data().following;
        const followBtn = document.querySelector('#follow-btn');

        if (following.some(e => e.id === currentProfile.id)) {
            followBtn.classList.add('followed')
            followBtn.textContent = 'FOLLOWING'
        } else {
            followBtn.classList.remove('followed');
            followBtn.textContent = 'FOLLOW'
        }
    }

    return (
        <div id='profile'>
            <div className="profile-page-header">
                <Header setProfileView={setProfileView} currentUser={currentUser} setSearch={setSearch} setSearchMode={setSearchMode} setCurrentProfile={setCurrentProfile} setInteraction={setInteraction} signIn={signIn} logOut={logOut} isUserSignedIn={isUserSignedIn} profilePic={profilePic} username={username} />
                <ProfileInfo setCurrentUser={setCurrentUser} profileImg={profileImg} setProfileImg={setProfileImg} bioPic={bioPic} setBioPic={setBioPic} profileBio={profileBio} setProfileBio={setProfileBio} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} currentUser={currentUser} follow={follow} followCount={followCount} editMode={editMode} setEditMode={setEditMode} setInteraction={setInteraction} profilePic={profilePic} setUserUpdate={setUserUpdate} />
                <ProfileNav profileView={profileView} setProfileView={setProfileView} setInteraction={setInteraction} />
            </div>
            <DisplayTweets setSearchMode={setSearchMode} setSearch={setSearch} draftMode={draftMode} setDraftMode={setDraftMode} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} uid={uid} checkSignIn={checkSignIn} username={username} profilePic={profilePic} tweets={tweets} setTweets={setTweets} setInteraction={setInteraction} currentUser={currentUser} setProfileView={setProfileView} />
        </div>
    )
}

const ProfileInfo = (props) => {
    const { setCurrentUser, setCurrentProfile, profilePic, profileBio, setProfileBio, currentProfile, currentUser, follow, followCount, editMode, setEditMode, setInteraction, bioPic, setBioPic, profileImg, setProfileImg, setUserUpdate } = props
    
    const backgroundImage = {
        backgroundImage: `url(${currentProfile.bioPic})`
    }

    if (editMode === false) {
        return (
            <div id='current-profile'>
                <div style={backgroundImage} id='current-profile-info'>
                    <img id='current-profile-pic' src={currentProfile.profilePic} alt='current-profile-pic' />
                </div>
                {currentProfile.id === currentUser.id && (
                    <div id='edit-profile-btn' onClick={() => setEditMode(true)}>Edit Profile</div>
                )}
                {currentProfile.id !== currentUser.id && (
                    <div id='follow-btn' onClick={() => follow()}>FOLLOW</div>
                )}
                <div id='current-profile-name'>{currentProfile.name}</div>
                <div id='profile-bio'>{profileBio}</div>
                <div id='date-section'>
                    <div id='date-title'>Joined</div>
                    <div id='date-joined'>{currentProfile.dateJoined}</div>
                </div>
                <FollowersSection follow={follow} followCount={followCount} currentProfile={currentProfile} currentUser={currentUser} />
            </div>
        )
    } else if (editMode === true) {
        return (
            <div id='current-profile'>
                {currentProfile.id !== currentUser.id && (
                    <div id='follow-btn' onClick={() => follow()}>FOLLOW</div>
                )}
                <div id='current-profile-info'>
                    <div id='current-profile-name'>{currentProfile.name}</div>
                </div>
                <EditProfile setCurrentUser={setCurrentUser} currentUser={currentUser} setCurrentProfile={setCurrentProfile} setUserUpdate={setUserUpdate} profilePic={profilePic} bioPic={bioPic} setBioPic={setBioPic} profileImg={profileImg} setProfileImg={setProfileImg} profileBio={profileBio} setProfileBio={setProfileBio} setEditMode={setEditMode} setInteraction={setInteraction} currentProfile={currentProfile} />
            </div>
        )
    }
}

const EditProfile = (props) => {
    const { setCurrentUser, currentUser, setCurrentProfile, profilePic, setEditMode, setInteraction, currentProfile, profileBio, setProfileBio, bioPic, setBioPic, profileImg, setProfileImg, setUserUpdate } = props

    const uploadImage = async () => {
        const user = doc(db, 'users', currentProfile.id);
        const pImg = document.querySelector(`#profile-pic`).files.length;
        const bImg = document.querySelector(`#background-img`).files.length;
        await updateDoc(user, {
            bio: profileBio,
        })
        if (pImg === 0 && bImg === 0) return;
        else if (pImg > 0 && bImg === 0) {
            const imageRef = ref(storage, `profilePics/${currentProfile.id}`);
            uploadBytes(imageRef, profileImg).then(() => {
                getDownloadURL(imageRef).then((url) => {
                    setCurrentProfile({...currentProfile, profilePic: url})
                    setCurrentUser({...currentUser, profilePic: url})
                    updateDoc(user, {
                        profilePic: url,
                    })
                })
            })
            setProfileImg(null)
        } else if (bImg > 0 && pImg === 0) {
            const imageRef = ref(storage, `backgroundPics/${currentProfile.id}`);
            uploadBytes(imageRef, bioPic).then(() => {
                getDownloadURL(imageRef).then((url) => {
                    setCurrentProfile({...currentProfile, bioPic: url})
                    updateDoc(user, {
                        bioPic: url,
                    })
                })
            })
            setBioPic(null)
        } else if (pImg > 0 && bImg > 0) {
            const profileRef = ref(storage, `profilePics/${currentProfile.id}`);
            uploadBytes(profileRef, profileImg).then(() => {
                getDownloadURL(profileRef).then((url) => {
                    setCurrentProfile({...currentProfile, profilePic: url})
                    setCurrentUser({...currentUser, profilePic: url})
                    updateDoc(user, {
                        profilePic: url,
                    })
                })
            })
            setProfileImg(null)
            const imageRef = ref(storage, `backgroundPics/${currentProfile.id}`);
            uploadBytes(imageRef, bioPic).then(() => {
                getDownloadURL(imageRef).then((url) => {
                    setCurrentProfile({...currentProfile, bioPic: url})
                    updateDoc(user, {
                        bioPic: url,
                    })
                })
            })
            setBioPic(null)
        }
    }

    const submitEdit = async (e) => {
        e.preventDefault();
        await uploadImage();
        setUserUpdate(true);
        setInteraction(true);
        setEditMode(false);
    }

    const removeImage = async (icon) => {
        const user = doc(db, 'users', currentProfile.id)
        if (icon === 'background') {
            await updateDoc(user, {
                bioPic: null,
            })
            setCurrentProfile({...currentProfile, bioPic: null})
        } else if (icon === 'profile') {
            await updateDoc(user, {
                profilePic: profilePic(),
            })
            setCurrentProfile({...currentProfile, profilePic: profilePic()});
        }
    }

    return (
        <div id='profile-edit'>
            <div id='edit-profile-pic'>
                <div className="edit-img-container">
                    <label id='profile-pic-title' htmlFor='profile-pic'>Profile Avatar: </label>
                    <input type='file' id='profile-pic' name='profile-pic' onChange={(e) => setProfileImg(e.target.files[0])} />
                </div>
                <div className='remove-pic' onClick={() => removeImage('profile')}>Remove Current Avatar</div>
            </div>
            <div id='edit-background-img'>
                <div className="edit-img-container">
                    <label id='background-img-title' htmlFor='background-img'>Profile Background: </label>
                    <input type='file' id='background-img' name='background-img' onChange={(e) => setBioPic(e.target.files[0])} />
                </div>
                <div className='remove-pic' onClick={() => removeImage('background')}>Remove Current Background</div>
            </div>
            <div id='bio-edit'>
                <label htmlFor='bio'>Bio: </label>
                <input type='text' name='bio' id='bio' placeholder='About you...' value={profileBio} maxLength={160} onChange={(e) => {setProfileBio(e.target.value)}} />
            </div>
            <div id='submit-profile-edit' type='submit' onClick={(e) => submitEdit(e)}>Done</div>
        </div>
    )
}

const ProfileNav = (props) => {
    const { setProfileView, setInteraction } = props;

    const clickedView = (view) => {
        let viewBtns = document.querySelectorAll(`.profile-view-btn`)
        viewBtns.forEach((btn) => {
            if (btn.textContent === view) {
                btn.classList.add('selected-profile-view')
            } else {
                btn.classList.remove('selected-profile-view')
            }
        })
    }

    return (
        <div id='profile-nav'>
            <div onClick={() => {clickedView('Tweets'); setInteraction(true); setProfileView('tweets')}} className='selected-profile-view profile-view-btn' id='tweets-view'>Tweets</div>
            <div onClick={() => {clickedView('Likes') ;setInteraction(true); setProfileView('likes')}} className='profile-view-btn' id='likes-view'>Likes</div>
            <div onClick={() => {clickedView('Retweets') ;setInteraction(true); setProfileView('retweets')}} className='profile-view-btn' id='retweets-view'>Retweets</div>
        </div>
    )
}

const FollowersSection = (props) => {
    const { currentProfile, currentUser, follow, followCount } = props;
    
    return (
        <div id='followers-section'>
            <div className='follow-section' id='followers'>
                <div className='follow-count'>{followCount.followers}</div>
                <div className='follow-section-title'>Followers</div>
            </div>
            <div className='follow-section' id='following'>
                <div className='follow-count'>{followCount.following}</div>
                <div className='follow-section-title'>Following</div>
            </div>
        </div>
    )
}