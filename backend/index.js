/* dependancies*/
const express = require("express");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");


/* config - express*/
const app = express();

/*
Config- firebase
*/
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'quasagram-82914.appspot.com'
});

const db = getFirestore();
// const bucket = getStorage().bucket();

/* endpoints*/
app.get("/blogs", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  let blogs = [];
  db.collection("blogs")
    .orderBy("created_at", "desc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        blogs.push(doc.data());
         response.send(blogs);
      });
    })
});


/* listen */
app.listen(3000);
