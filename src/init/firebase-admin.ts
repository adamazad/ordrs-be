import { FIREBASE_SERVICE_ACCOUNT } from '@constants';
import FirebaseAdmin from 'firebase-admin';

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
  databaseURL: 'https://construyo-coding-challenge.firebaseio.com',
});
