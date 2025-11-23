const admin = require("firebase-admin");
require("dotenv").config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey && privateKey.indexOf("\\n") !== -1) {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();
bucket
  .getMetadata()
  .then(() => console.log("Firebase Storage connected successfully"))
  .catch((err) =>
    console.error("Firebase Storage connection failed:", err.message)
  );
module.exports = { admin, bucket };
