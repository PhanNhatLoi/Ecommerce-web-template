import firebase from 'firebase/app';
import 'firebase/messaging';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: 'AIzaSyBNFPGMec_IzW6pkH5eMfgoU8krldRTDq4',
  authDomain: 'ecaraid-uat-new.firebaseapp.com',
  projectId: 'ecaraid-uat-new',
  storageBucket: 'ecaraid-uat-new.appspot.com',
  messagingSenderId: '48651848312',
  appId: '1:48651848312:web:ce1c2ca4789066807f7b8d',
  measurementId: 'G-VF91RQ0CJT'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
