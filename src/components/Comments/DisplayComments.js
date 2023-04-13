import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { getDocs, collection } from 'firebase/firestore'

export const DisplayComments = (props) => {
    if (props.openTweet.open === true && props.openTweet.id === props.tweetId) {
        return (
            <div className='comment-section'>
                {props.comments.map(comment => {
                    return (
                        <div key={Math.random()} className='comment'>
                            {comment.message}
                        </div>
                    )
                })}
            </div>
        )
    }
}