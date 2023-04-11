import React from 'react';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const WriteTweet = async (message) => {
    try {
        await addDoc(collection(db, 'tweets'), {
            name: `${getAuth().currentUser.displayName}`,
            message: message,
            time: serverTimestamp(),
            profilePic: '',
        })
    } catch (error) {
        console.error("Error with message: ", error);
    }
}