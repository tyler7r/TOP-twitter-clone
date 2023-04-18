import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from './Nav';
import Logo from '../images/iconmonstr-twitter-1.svg'
import '../styles/header.css'

export const Header = (props) => {
    const { setCurrentProfile, setSearchMode, setSearch, setInteraction, signIn, logOut, isUserSignedIn, profilePic, username } = props;
    
    return (
        <div id='header'>
            <Link to='/'><img onClick={() => {setCurrentProfile(''); setSearchMode(false); setSearch(''); setInteraction(true)}} id='header-logo' alt='main-logo' src={Logo}/></Link>
            <div id='main-title'>Tyler's Twitter</div>
            <Nav signIn={signIn} logOut={logOut} isUserSignedIn={isUserSignedIn} profilePic={profilePic} username={username} />
        </div>
    )
}