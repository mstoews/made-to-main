import admin = require("firebase-admin");

// const creds = require("made-to-cassie.json");

admin.initializeApp();

export const db = admin.firestore();

export const auth = admin.auth();
