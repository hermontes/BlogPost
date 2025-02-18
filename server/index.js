const express = require("express");
const mongoose = require("mongoose");
const app = express(); //initializes an Express application.
const cors = require("cors");
const PostsStructure = require("./models/PostsStructure");
require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// To parse incoming JSON data
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

// Root route handler
app.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

// Creating a new blog post
app.post("/createContent", async (req, res) => {
  //receiving all the fields we created from the front-end
  const title = req.body.title;
  const author = req.body.author;
  const content = req.body.content;
  const comments = req.body.comments;
  const image = req.body.image;

  const post = new PostsStructure({
    title: title,
    content: content,
    author: author,
    image: image,
    comments: comments,
  });

  try {
    await post.save().then(() =>
        console.log("Server: Created content on MongoDB successfully!")
      );

    return res.send("Data inserted into MongoDB");
  } catch (err) {
    console.log(err + "sent data to MongoDB and got error");
    res.send("Data did not insert in MongoDB");
  }
});

app.put("/makeComment", async (req, res) => {
  const title = req.body.title;
  // const newComment = req.body.comments
  const newComment = {
    author: req.body.comments.name,
    text: req.body.comments.text,
    likeCount: req.body.comments.likeCount,
    dislikeCount: req.body.comments.dislikeCount,
  };

  try {
    const put = await PostsStructure.findOne({ title: title });
    put.comments.push(newComment);
    await put.save();

    res.send("updated");
  } catch (err) {
    console.log("Making a comment threw an error!" + err);
  }
});

app.put("/updateLike", async (req, res) => {
  const title = req.body.title;

  const id = req.body.comments.id;
  const newLikes = req.body.comments.likeCount;

  try {
    const put = await PostsStructure.findOne({ title: title });
    const comment = put.comments.id(id);
    comment.likeCount = newLikes;
    await put.save();

    res.send("updated");
  } catch (err) {
    console.log(err);
  }
});

app.put("/updateDislike", async (req, res) => {
  const title = req.body.title;

  const id = req.body.comments.id;
  const newdislikeCount = req.body.comments.dislikeCount;

  try {
    const put = await PostsStructure.findOne({ title: title });
    const comment = put.comments.id(id);
    comment.dislikeCount = newdislikeCount;
    await put.save();

    res.send("updated");
  } catch (err) {
    console.log(err);
  }
});



app.get("/getContent", async (req, res) => {
  // PostsStructure.find({ $where:{ title:""},})
  PostsStructure.find({}, (err, result) => {
    if (err) {
      console.log("CANT GET CONTENT" + err);

      res.send(err);
    } else {
      console.log("Sent content from server");
      res.send(result);
    }
  });
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
