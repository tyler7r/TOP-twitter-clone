import React from "react";
import '../styles/feed.css'
import MagnifyingGlass from '../images/search.png'

export const Search = (props) => {
    const { setDraftMode, setInteraction, setSearchMode, search, setSearch } = props;

    const submitSearch = (e) => {
        if (search.length === 0) return;
        e.preventDefault();
        setInteraction(true);
        setSearchMode(true);
    }

    return (
        <div id='searchbar'>
            <input type='text' value={search} name='search' id='search' placeholder="Search Tyler's Twitter" onClick={() => setDraftMode(false)} onChange={(e) => setSearch(e.target.value)} maxLength={100} />
            <img id='search-btn' onClick={(e) => {submitSearch(e)}} type='submit' src={MagnifyingGlass} alt='search-icon' />
        </div>
    )
}