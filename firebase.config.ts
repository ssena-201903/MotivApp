import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDJ3wnXBH79HM2yKIsahsjjdeWraxb1BcA",
    authDomain: "motivapp-dde03.firebaseapp.com",
    projectId: "motivapp-dde03",
    storageBucket: "motivapp-dde03.appspot.com",
    messagingSenderId: "917230438716",
    appId: "1:917230438716:android:1840ea0634f199aab9b639",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);