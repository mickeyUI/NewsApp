import { initializeApp } from "@react-native-firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getFirestore } from "@react-native-firebase/firestore";
import { getMessaging, getToken } from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
const firebaseConfig = {
  apiKey: "AIzaSyAw6z41TwMtBg7sEYsFZGdWI0DCJJyjHS0",
  authDomain: "newsapp-9d962.firebaseapp.com",
  projectId: "newsapp-9d962",
  storageBucket: "newsapp-9d962.firebasestorage.app",
  messagingSenderId: "638895929398",
  appId: "1:638895929398:android:9ccab0b47492059b2a8097",
  databaseURL:
    "https://newsapp-9d962-default-rtdb.europe-west1.firebasedatabase.app",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const messaging = getMessaging(app);
const getAsyncRequred = async () => {
  const token = await getToken(messaging);
  const permission = await Notifications.getPermissionsAsync();
  console.log("Notification permission:", permission);
};
getAsyncRequred();

GoogleSignin.configure({
  webClientId:
    "638895929398-igqr1i5nvkd57b60egod8untk96k2vo0.apps.googleusercontent.com",
  offlineAccess: true,
});

export const signInWithGoogle = async () => {
  await GoogleSignin.signOut();
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  // v13+ places idToken inside response.data
  const idToken = response.data?.idToken || response.idToken;

  if (!idToken) {
    throw new Error("Failed to retrieve ID token from Google Sign-In.");
  }

  const googleCredential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, googleCredential);
};

export let pendingNotification = null;
