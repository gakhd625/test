
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace these placeholder values with your actual Firebase project credentials
// Get these from your Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "your-api-key-here", // Replace with your actual API key
  authDomain: "your-project-id.firebaseapp.com", // Replace with your project ID
  projectId: "your-project-id", // Replace with your actual project ID
  storageBucket: "your-project-id.appspot.com", // Replace with your project ID
  messagingSenderId: "your-messaging-sender-id", // Replace with your sender ID
  appId: "your-app-id" // Replace with your actual app ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
