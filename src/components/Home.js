import React from 'react';
import { Header } from './Header';

export const Home = (props) => {
    return (
        <div id='home-page'>
            <Header signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
        </div>
    )
}