import React from 'react';

export const Nav = (props) => {
    const { isUserSignedIn, profilePic, username, logOut, signIn } = props;
    
    if (isUserSignedIn === true) {
        return (
            <div id='main-nav'>
                <img id='profile-icon' src={profilePic()} alt='profile-pic'/>
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