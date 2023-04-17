import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from './Nav';
import Logo from '../images/iconmonstr-twitter-1.svg'
import '../styles/header.css'

export const Header = (props) => {
    return (
        <div id='header'>
            <Link to='/'><img onClick={() => {props.setCurrentProfile(''); props.setInteraction(true)}} id='header-logo' alt='main-logo' src={Logo}/></Link>
            <div id='main-title'>Tyler's Twitter</div>
            <Nav signIn={props.signIn} logOut={props.logOut} isUserSignedIn={props.isUserSignedIn} profilePic={props.profilePic} username={props.username} />
        </div>
    )
}