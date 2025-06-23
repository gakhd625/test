import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {getAnalytics} from 'firebase/analytics';
// TODO: Replace these placeholder values with your actual Firebase project credentials
// Get these from your Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDqJu9yA_X5Dob8ElFV46L6jXWTSC8ZPQI",
  authDomain: "picjourni.firebaseapp.com",
  projectId: "picjourni",
  storageBucket: "picjourni.appspot.com",
  messagingSenderId: "293843006975",
  appId: "1:293843006975:web:0e6d4ce797fe2bfb4523ca",
  measurementId: "G-5C7FQY8L0W"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
