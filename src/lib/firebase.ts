import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzfSyBdFvTUnWNeQ4NbaZ2b9sVF2QKaoQPeX1w",
  authDomain: "servicelink-848ee.firebaseapp.com",
  projectId: "servicelink-848ee",
  storageBucket: "servicelink-848ee.appspot.com",
  messagingSenderId: "138933913770",
  appId: "1:138033913770:web:a40a55d20f370b589f55d3",
  measurementId: "G-9JSPZ5RHYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Firebase Auth Helper Functions
const firebaseAuth = {
  createUserWithEmailAndPassword: (email: string, password: string) => 
    createUserWithEmailAndPassword(auth, email, password),

  signInWithEmailAndPassword: (email: string, password: string) => 
    signInWithEmailAndPassword(auth, email, password),

  signInWithGoogle: () => signInWithPopup(auth, googleProvider),
};

// Firestore Helper Functions
const firestoreOperations = {
  saveUserData: async (uid: string, data: { name: string; email: string; phone?: string; role: string }) => {
    const collectionName = data.role === 'technician' ? 'technicians' : 'customers';
    const userRef = doc(db, collectionName, uid);
    await setDoc(userRef, {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role,
      createdAt: new Date().toISOString(),
    });
  },

  checkUserRole: async (uid: string, role: string) => {
    const collectionName = role === 'technician' ? 'technicians' : 'customers';
    const userRef = doc(db, collectionName, uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  },
  getUserRole: async (uid: string) => {
    const techDoc = await getDoc(doc(db, 'technicians', uid));
    if (techDoc.exists()) return 'technician';
    const custDoc = await getDoc(doc(db, 'customers', uid));
    if (custDoc.exists()) return 'customer';
    return null;
  },
};

export { auth, db, firebaseAuth, firestoreOperations };