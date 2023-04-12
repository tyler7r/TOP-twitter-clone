import React from "react";
import { DisplayTweets } from "./DisplayTweets";

export const Feed = (props) => {
    return (
        <DisplayTweets username={props.username} profilePic={props.profilePic} tweets={props.tweets} setTweets={props.setTweets} interaction={props.interaction} setInteraction={props.setInteraction} />
    )
}