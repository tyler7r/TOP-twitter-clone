import React from "react";
import { DisplayTweets } from "./DisplayTweets";

export const Feed = (props) => {
    return (
        <DisplayTweets tweets={props.tweets} setTweets={props.setTweets} interaction={props.interaction} setInteraction={props.setInteraction} />
    )
}