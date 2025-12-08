import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 고정된 Firebase 설정 (요청한 값으로 통일)
const firebaseConfig = {
  apiKey: 'AIzaSyD_2QArBgMN2oVtZMlk0ZB8vqJRDaJkyNo',
  authDomain: 'animerecommendation-84c46.firebaseapp.com',
  projectId: 'animerecommendation-84c46',
  storageBucket: 'animerecommendation-84c46.firebasestorage.app',
  messagingSenderId: '374674188740',
  appId: '1:374674188740:web:673979f2d0f50e4dc35c91',
  measurementId: 'G-LKTX5X27G1',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app, firebaseConfig.storageBucket);
