import firebase from 'firebase/app';
import 'firebase/auth';

export const assignClick = (elementId, func) => {
  const clickElement = document.getElementById(elementId);
  if (clickElement) clickElement.onclick = func;
};

export const initializeSigninButtons = () => {
  const signInButton = document.getElementById('appbar-signin-button');
  const signOutButton = document.getElementById('appbar-signout-button');
  const addTuneButton = document.getElementById('appbar-addtune-button');
  const mySongsLink = document.getElementById('appbar-mysongs-link');

  if (signInButton && signOutButton && addTuneButton && mySongsLink) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && !user.isAnonymous) {
        signInButton.style.display = 'none';
        signOutButton.style.display = 'inline-block';
        addTuneButton.style.display = 'inline-block';
        mySongsLink.style.display = 'inline-block';
      } else {
        signInButton.style.display = 'inline-block';
        signOutButton.style.display = 'none';
        addTuneButton.style.display = 'none';
        mySongsLink.style.display = 'none';
      }
    });
  }
};
