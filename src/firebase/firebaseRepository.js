import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { firestoreDb, cloudStorage } from './firebaseConfiguration';

export const writeSongToFirestore = (songArtist, songTitle, songFile) => {
  const song = {
    songArtist,
    songTitle,
    songFileName: songFile.name,
  };

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const songsCollection = firestoreDb.collection(`users/${user.uid}/songs`);

      songsCollection
        .add(song)
        .then((docRef) => {
          console.log('Song document is: ', docRef.id);
          saveSongFile(user.uid, docRef.id, songFile);
        })
        .catch((error) => console.error('There was an error while writing a song to firestore: ', error));
    }
  });
};

const saveSongFile = (userId, docRefId, songFile) => {
  const fileRef = cloudStorage.ref(`songs/${userId}/${docRefId}-${songFile.name}`);
  const uploadTask = fileRef.put(songFile);

  uploadTask.on(
    'state_changed',

    function progress(snapshot) {
      console.log('Byes transferred: ', snapshot.bytesTransferred);
      console.log('Total: bytes: ', snapshot.totalBytes);
    },

    function error(error) {
      console.error('There was an error while saving to Cloud Storage: ', error);
    },

    function complete() {
      console.log('File successfully saved to Cloud Storage');
    },
  );
};

export const readSongsFromFirestore = () => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const songs = [];

        const songsCollection = firestoreDb.collection(`users/${user.uid}/songs`);

        songsCollection.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const songData = { ...doc.data(), id: doc.id };
            songs.push(songData);
          });
          resolve(songs);
        });
      }
    });
  });
};

export const deleteSongFromFirestore = (songId) => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const songDocument = firestoreDb.doc(`users/${user.uid}/songs/${songId}`);

        songDocument
          .delete()
          .then(() => console.log(`The song with an id of ${songId} has been deleted successfully`))
          .catch((error) => console.error(`There was an error while trying to delete song with id ${songId}`, error));

        resolve();
      }
    });
  });
};

export const getSongFromFirestore = (songId) => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Assign the reference to the song document using songId
        const songDocument = firestoreDb.doc(`users/${user.uid}/songs/${songId}`);

        // Get the song data from Firestore
        songDocument
          .get()
          .then((doc) => {
            if (doc.exists) {
              const songData = { ...doc.data(), id: doc.id };
              resolve(songData);
            }
          })
          .catch((error) => {
            console.error(`There was an error while trying to get song with id ${songId}`, error);
            resolve();
          });
      }
    });
  });
};

export const updateSongInFirebase = (song) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const songDocument = firestoreDb.doc(`users/${user.uid}/songs/${song.id}`);

      const updatedSong = {
        songArtist: song.songArtist,
        songTitle: song.songTitle,
      };

      songDocument
        .update(updatedSong)
        .then(() => console.log('You song was updated successfully', song))
        .catch((error) => console.error('There was an errror while updating your song: ', error));
    }
  });
};

export const getAudioFromStorage = (userId, fileName) => {
  return new Promise((resolve) => {
    // Get the reference to the file in Cloud Storage
    const fileRef = cloudStorage.ref(`songs/${userId}/${fileName}`);

    // Get the URL for the song file in Cloud Storage
    fileRef
      .getDownloadURL()
      .then((url) => resolve(url))
      .catch((error) => console.error('There was an error while retrieving a file from Cloud Storage', error));
  });
};
