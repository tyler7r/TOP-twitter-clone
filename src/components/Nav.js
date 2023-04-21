import React from 'react';
import { Link } from 'react-router-dom';

export const Nav = (props) => {
    const { isUserSignedIn, profilePic, username, logOut, signIn, setInteraction, setCurrentProfile, currentUser, setProfileView, setSearch, setSearchMode } = props;
    
    if (isUserSignedIn === true) {
        return (
            <div id='main-nav'>
                <Link to={'/profile/' + currentUser.id}><img onClick={() => {setInteraction(true); setProfileView('tweets'); setSearch(''); setSearchMode(false)}} id='profile-icon' src={currentUser.profilePic} alt='profilePic' /></Link>
                <div id='profile-name'>{username()}</div>
                <div id='log-out-button' onClick={() => logOut()}>Log Out</div>
            </div>
        )
    } else {
        return (
            <div id='main-nav'>
                <div id='sign-in-button' onClick={() => signIn()}>Sign In</div>
            </div>
        )
    }
}