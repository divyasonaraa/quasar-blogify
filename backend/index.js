/* dependancies*/
const express = require("express");
const cors = require("cors");
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
let webpush = require("web-push");

/* config - express*/
const app = express();
app.use(cors());

/*
Config- firebase
*/
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const publicKey =
  "BBSquFX8ox1F3YU6eEvDNsszQKr1ShOKNk27HrjzhNezmJxgk8kWLPvuBKLQogEnRVAp_pm97JhwLl0nwdjh-Bw";
const privateKey = "eN1G9mLPirxVHV3gA3usMX8xZr9Au1Qbr7VXfbNruJw";

// VAPID keys should be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

/*
  config - webpush
*/

webpush.setVapidDetails(
  "mailto:divya.sonara@simformsolutions.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

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

/* endpoint - get blog by id */
app.get("/blog/:id", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  const { id } = request.params;

  db.collection("blogs")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        response.send(doc.data());
      } else {
        response.status(404).send("Blog not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching blog:", error);
      response.status(500).send("Internal Server Error");
    });
});

/*
endpoint- create post
*/

app.post("/blog", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  let uuid = UUID();
  let fields = {};
  let fileData = {};

  const bb = busboy({ headers: request.headers });
  bb.on("file", (name, file, info) => {
    const { filename, encoding, mimeType } = info;

    let filepath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filepath));
    fileData = { filepath, mimeType };
  });
  bb.on("field", (name, val, info) => {
    console.log(`Field [${name}]: value: %j`, val);
    fields[name] = val;
  });
  bb.on("close", () => {
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
        sendPushNotification();
        response.send("blog added: " + fields.id);
      });
    function sendPushNotification() {
      let subscriptions = [];
      db.collection("subscriptions")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            subscriptions.push(doc.data());
          });
          return subscriptions;
        })
        .then((subscriptions) => {
          subscriptions.forEach((subscription) => {
            const pushSubscription = {
              endpoint: subscription.endpoint,
              keys: {
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh,
              },
            };
            let pushContent = {
              title: "New Blog Created!",
              body: "New Blog Added! Check it out!",
              openUrl: "/#/",
            };
            let pushContentStringified = JSON.stringify(pushContent);
            try {
              webpush.sendNotification(
                pushSubscription,
                pushContentStringified
              );
            } catch (error) {
              console.error("Error sending push notification:", error);
            }
          });
        });
    }
  });

  request.pipe(bb);
});

/* endpoint - update post */
app.put("/blog/:id", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  const { id } = request.params;
  let updatedBlog = {};

  // Parse the request body
  request.on("data", (chunk) => {
    updatedBlog = JSON.parse(chunk.toString());
  });

  request.on("end", () => {
    db.collection("blogs")
      .doc(id)
      .update({
        ...updatedBlog,
        updated_at: FieldValue.serverTimestamp(),
      })
      .then(() => {
        response.send("blog updated: " + id);
      })
      .catch((error) => {
        console.error("Error updating blog:", error);
        response.status(500).send("Internal Server Error");
      });
  });
});

/* endpoint - delete post */
app.delete("/blog/:id", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  const { id } = request.params;

  db.collection("blogs")
    .doc(id)
    .delete()
    .then(() => {
      response.send("blog deleted: " + id);
    })
    .catch((error) => {
      console.error("Error deleting blog:", error);
      response.status(500).send("Internal Server Error");
    });
});

app.get("/", (request, response) => {
  response.send("welcome to Blogify!");
});

// Endpoint to get liked blogs
app.get("/blogs/liked", (request, response) => {
  db.collection("blogs")
    .where("liked", "==", true)
    .get()
    .then((snapshot) => {
      const likedBlogs = [];
      snapshot.forEach((doc) => {
        likedBlogs.push(doc.data());
      });
      response.send(likedBlogs);
    })
    .catch((error) => {
      console.error("Error fetching liked blogs:", error);
      response.status(500).send("Internal Server Error");
    });
});

// Endpoint to get favorite blogs
app.get("/blogs/favorites", (request, response) => {
  db.collection("blogs")
    .where("favorite", "==", true)
    .get()
    .then((snapshot) => {
      const favoriteBlogs = [];
      snapshot.forEach((doc) => {
        favoriteBlogs.push(doc.data());
      });
      response.send(favoriteBlogs);
    })
    .catch((error) => {
      console.error("Error fetching favorite blogs:", error);
      response.status(500).send("Internal Server Error");
    });
});

// Endpoint to toggle like status
app.post("/blog/:id/toggle-like", (request, response) => {
  const { id } = request.params;

  // Get the current like status
  db.collection("blogs")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        response.status(404).send("Blog not found");
        return;
      }

      const currentLikeStatus = doc.data().liked || false;

      // Toggle the like status
      db.collection("blogs")
        .doc(id)
        .update({
          liked: !currentLikeStatus,
        })
        .then(() => {
          const message = !currentLikeStatus ? "Blog liked" : "Blog unliked";
          response.send(message + ": " + id);
        })
        .catch((error) => {
          console.error("Error toggling like status:", error);
          response.status(500).send("Internal Server Error");
        });
    })
    .catch((error) => {
      console.error("Error fetching blog:", error);
      response.status(500).send("Internal Server Error");
    });
});

// Endpoint to toggle favorite status
app.post("/blog/:id/toggle-favorite", (request, response) => {
  const { id } = request.params;

  // Get the current favorite status
  db.collection("blogs")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        response.status(404).send("Blog not found");
        return;
      }

      const currentFavoriteStatus = doc.data().favorite || false;

      // Toggle the favorite status
      db.collection("blogs")
        .doc(id)
        .update({
          favorite: !currentFavoriteStatus,
        })
        .then(() => {
          const message = !currentFavoriteStatus
            ? "Blog marked as favorite"
            : "Blog removed from favorites";
          response.send(message + ": " + id);
        })
        .catch((error) => {
          console.error("Error toggling favorite status:", error);
          response.status(500).send("Internal Server Error");
        });
    })
    .catch((error) => {
      console.error("Error fetching blog:", error);
      response.status(500).send("Internal Server Error");
    });
});

/*
  endpoint - createSubscription
*/

app.post("/createSubscription", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  db.collection("subscriptions")
    .add(request.query)
    .then((docRef) => {
      response.send({
        message: "Subscription added!",
        postData: request.query,
      });
    });
});

/* listen */
app.listen(3000);
