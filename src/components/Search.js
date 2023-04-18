import React, { useState } from "react";

export const Search = (props) => {
    const submitSearch = (e) => {
        e.preventDefault();
        props.setInteraction(true);
        props.setSearchMode(true);
    }

    return (
        <div id='searchbar'>
            <input type='text' value={props.search} name='search' id='search' placeholder='Search Twitter Clone' onChange={(e) => props.setSearch(e.target.value)}/>
            <button onClick={(e) => {submitSearch(e)}} type='submit'>Submit</button>
        </div>
    )
}