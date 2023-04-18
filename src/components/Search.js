import React from "react";

export const Search = (props) => {
    const { setInteraction, setSearchMode, search, setSearch } = props;

    const submitSearch = (e) => {
        e.preventDefault();
        setInteraction(true);
        setSearchMode(true);
    }

    return (
        <div id='searchbar'>
            <input type='text' value={search} name='search' id='search' placeholder='Search Twitter Clone' onChange={(e) => setSearch(e.target.value)}/>
            <button onClick={(e) => {submitSearch(e)}} type='submit'>Submit</button>
        </div>
    )
}