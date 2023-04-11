import React from 'react';

export const Home = (props) => {
    return (
        <div id='sign-in-button' onClick={() => props.signIn()}>Sign In</div>
    )
}