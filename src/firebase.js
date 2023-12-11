import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8ibyQzlezHo5T7GHo7m0t6BAvE-g0-Gk",
    authDomain: "fabilab-atlasapprox.firebaseapp.com",
    projectId: "fabilab-atlasapprox",
    storageBucket: "fabilab-atlasapprox.appspot.com",
    messagingSenderId: "25981094472",
    appId: "1:25981094472:web:59884f3b9d534ec3c1667d",
    measurementId: "G-8E2BPLWQFZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };