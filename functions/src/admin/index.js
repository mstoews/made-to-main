const admin = require('firebase-admin');

const dotenv = require("dotenv");
const process = require("process");

const result = dotenv.config();

const serviceAccountPath = `./${process.env.SERVICE_ACCOUNT_FILE_NAME}`;

console.log('process.env.SERVICE_ACCOUNT_FILE_NAME', process.env.SERVICE_ACCOUNT_FILE_NAME)

admin.initializeApp({
   credential: admin.credential.cert(serviceAccountPath),
   databaseURL:process.env.FIRESTORE_DATABASE_URL
});

const auth = admin.auth();

const uid = process.argv[2];

const customClaims = {
    admin: true,
};

(async() => {
    await auth.setCustomUserClaims(uid, customClaims);
    const user = await auth.getUser(uid);
    console.log('success', user)
    process.exit()
})();
