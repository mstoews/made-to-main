import firebase from 'firebase/app';
import Timestamp = firebase.Timestamp;

export interface Comments {
  id: string;
  description: string;
  longDescription: string;
  enteredAt: Timestamp;
  user: string;
}

