/* dependancies*/
const express = require("express");


/* config - express*/
const app = express();
const port = 3000;

/* endpoints*/
app.get("/blogs", (request, response) => {
  let blogs = [
    {
      id: 1,
      title: "Example this is my first Blog",
      content:
        "This is mY first blog This is mY first blogThis is mY first blogThis is mY first blogThis is mY first blogThis is mY first blogThis is mY first blogThis is mY first blogThis is mY first blogThis is mY first blogThis is mY first blogThis is mY first blog",
      created_at: "",
      updated_at: "",
    },
  ];
  response.send(blogs);
});


/* listen */
app.listen(3000);
