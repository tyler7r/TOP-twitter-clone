import React from 'react';
import { Nav } from './Nav';
import Logo from '../images/iconmonstr-twitter-1.svg'
import '../styles/header.css'

export const Header = (props) => {
    return (
        <div id='header'>
            <img id='header-logo' alt='main-logo' src={Logo}/>
            <div id='main-title'>Tyler's Twitter</div>
            <Nav signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
        </div>
    )
}