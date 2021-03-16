import * as admin from "firebase-admin";

const DATABASE_NAME = "kitchenfuel-data"
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${DATABASE_NAME}.firebaseio.com`,
});

const db = admin.firestore();

export { admin, db };
