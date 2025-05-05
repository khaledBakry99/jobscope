// تكوين Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAr4xtIZgS6t_MHmhDwNDcgVtmZ5_ua-BI",
  authDomain: "jobscope-6cfe6.firebaseapp.com",
  projectId: "jobscope-6cfe6",
  storageBucket: "jobscope-6cfe6.firebasestorage.app",
  messagingSenderId: "329127698057",
  appId: "1:329127698057:web:97f5d6144219c7bedbf058",
  measurementId: "G-MBQ5LW9TWP"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
