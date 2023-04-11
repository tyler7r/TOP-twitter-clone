import React from 'react';

export const Nav = (props) => {
    console.log(props);
    if (props.isUserSignedIn === true) {
        return (
            <div id='main-nav'>
                <div id='profile-icon'>{props.profilePic()}</div>
                <div id='profile-name'></div>
                <div id='log-out-button' onClick={() => props.logOut()}>Log Out</div>
            </div>
        )
    } else {
        return (
            <div id='main-nav'>
                <div id='profile-icon'>{props.profilePic()}</div>
                <div id='sign-in-button' onClick={() => props.signIn()}>Sign In</div>
            </div>
        )
    }
}