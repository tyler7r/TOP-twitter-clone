import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { getDocs, collection } from 'firebase/firestore'

export const DisplayComments = (props) => {
    if (props.openTweet === true) {
        return (
            <div className='comment-section'>
                {props.comments.map(comment => {
                    return (
                        <div key={Math.random()} id='comment'>
                            {comment.message}
                        </div>
                    )
                })}
            </div>
        )
    }
}