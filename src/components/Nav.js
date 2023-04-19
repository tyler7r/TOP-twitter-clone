import React from 'react';
import { Link } from 'react-router-dom';

export const Nav = (props) => {
    const { isUserSignedIn, profilePic, username, logOut, signIn, setInteraction, setCurrentProfile, currentUser, setProfileView, setSearch, setSearchMode } = props;
    
    if (isUserSignedIn === true) {
        return (
            <div id='main-nav'>
                <Link to='/profile'><img onClick={() => {setInteraction(true); setCurrentProfile({author: `${currentUser}`, name: username(), profilePic: profilePic() }); setProfileView('tweets'); setSearch(''); setSearchMode(false)}} id='profile-icon' src={profilePic()} alt='profilePic' /></Link>
                <div id='profile-name'>{username()}</div>
                <div id='log-out-button' onClick={() => logOut()}>Log Out</div>
            </div>
        )
    } else {
        return (
            <div id='main-nav'>
                <img id='profile-icon' src={profilePic()} alt='profile-pic' />
                <div id='sign-in-button' onClick={() => signIn()}>Sign In</div>
            </div>
        )
    }
}