import '../firebase/firebaseConfiguration';
import { assignClick, initializeSigninButtons } from './utilities.js';
import {
  googleSignin,
  signOut,
  facebookSignin,
  twitterSignin,
} from '../firebase/firebaseAuthentication';

initializeSigninButtons();

assignClick('signin-google', googleSignin);
assignClick('signin-facebook', facebookSignin);
assignClick('signin-twitter', twitterSignin);
assignClick('appbar-signout-button', signOut);
