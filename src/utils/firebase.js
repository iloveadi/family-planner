import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDy1MksO6T1fZxat8f6Lijgn4BKhB6lkik",
    authDomain: "family-planner-f87e6.firebaseapp.com",
    projectId: "family-planner-f87e6",
    storageBucket: "family-planner-f87e6.firebasestorage.app",
    messagingSenderId: "283769683053",
    appId: "1:283769683053:web:dd082c50725c150afd5364"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
