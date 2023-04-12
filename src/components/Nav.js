import React from 'react';

export const Nav = (props) => {
    if (props.isUserSignedIn === true) {
        return (
            <div id='main-nav'>
                <img id='profile-icon' src={props.profilePic()} alt='profile-pic'/>
                <div id='profile-name'>{props.username()}</div>
                <div id='log-out-button' onClick={() => props.logOut()}>Log Out</div>
            </div>
        )
    } else {
        return (
            <div id='main-nav'>
                <img id='profile-icon' src={props.profilePic()} alt='profile-pic' />
                <div id='sign-in-button' onClick={() => props.signIn()}>Sign In</div>
            </div>
        )
    }
}