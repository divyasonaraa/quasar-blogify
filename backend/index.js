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
const busboy = require("busboy");
let path = require("path");
let os = require("os");
let fs = require("fs");
let UUID = require("uuid-v4");


/* config - express*/
const app = express();

/*
Config- firebase
*/
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

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
      });
      response.send(blogs);
    })
    .catch((error) => {
      console.error("Error fetching blogs:", error);
      response.status(500).send("Internal Server Error");
    });
});

/*
endpoint- create post
*/

app.post("/blog", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  let uuid = UUID()
  let fields = {}
  let fileData = {}

  const bb = busboy({ headers: request.headers });
    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;

     let filepath =  path.join(os.tmpdir(),filename)
     file.pipe(fs.createWriteStream(filepath))
     fileData = {filepath , mimeType}
    });
    bb.on('field', (name, val, info) => {
      console.log(`Field [${name}]: value: %j`, val);
      fields[name] = val
    });
    bb.on('close', () => {
      db.collection("blogs")
        .doc(fields.id)
        .set({
          id: fields.id,
          title: fields.title,
          content: fields.content,
          created_at: parseInt(fields.created_at),
          updated_at: parseInt(fields.created_at),
        })
        .then(() => {
          response.send("blog added: " + fields.id);
        });
    });
    request.pipe(bb);
});



app.get("/", (request, response) => {
  response.send("welcom to Blogify!");
});

/* listen */
app.listen(3000);
