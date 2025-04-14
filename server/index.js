const express = require("express");
const mongoose = require("mongoose");
const app = express(); //initializes an Express application.
const cors = require("cors");
const PostsStructure = require("./models/PostsStructure");
require("dotenv").config();

const WebSocket = require("ws");
const server = app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
const wss = new WebSocket.Server({ server });

// WebSocket connection
wss.on("connection", (ws) => {
  const dbChangesListener = PostsStructure.watch();

  console.log("Client connected");

  dbChangesListener.on("change", (change) => {
    if (change.operationType === "insert" && ws.readyState === WebSocket.OPEN) {
      const newChanges = {
        operationType: change.operationType,
        fullDocument: change.fullDocument,
      };
      console.log("Change detected:", change);
      ws.send(JSON.stringify(newChanges));
    }

    if (change.operationType === "update" && ws.readyState === WebSocket.OPEN) {
      // Check if the update is for comments
      const listOfUpdatedFields = change.updateDescription.updatedFields;
      const isCommentUpdate = Object.keys(listOfUpdatedFields).some(key => key.startsWith('comments.'));
    
      if (isCommentUpdate) {
        const updatedCommentKey = Object.keys(listOfUpdatedFields)[0]; // e.g., 'comments.19'
        const newComment = listOfUpdatedFields[updatedCommentKey];

        const parentDocumentKey = change.documentKey._id;
        

        console.log("comment fix:", newComment)
        const commentChange = {
          parentDocumentKey: parentDocumentKey,
          operationType: "update",
          newComment: newComment,
        };

        ws.send(JSON.stringify(commentChange)); // Send the new comment to the client
      }
    }
  });
  // Receiving client messages
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    dbChangesListener.close();
  });
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// To parse incoming JSON data
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
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
    await post
      .save()
      .then(() =>
        console.log("Server: Saved content to MongoDB successfully!")
      );

    return res.send("Data inserted into MongoDB");
  } catch (err) {
    console.log(err + "sent data to MongoDB and got error");
    res.send("Data did not insert in MongoDB");
  }
});

app.put("/makeComment", async (req, res) => {
  const documentID = req.body._id;
  console.log("Document ID: " + documentID);
  const newComment = {
    author: req.body.comments.name,
    text: req.body.comments.text,
    likeCount: 0,
    dislikeCount: 0,
  };

  try {
    await PostsStructure.findByIdAndUpdate(
      documentID,
      { $push: { comments: newComment } },
      { new: true }
    );
    console.log("BE: New comment added to MongoDB")
    res.send("Server: Comment added successfully");
  } catch (err) {
    console.log("Making a comment threw an error!" + err);
  }
});

// This endpoint updates the like or dislike count for a specific comment
app.put("/updateLikeOrDislike", async (req, res) => {
  const blogId = req.body.id;
  const commentId = req.body.commentInfo.id;
  //new like or dislike count passed from the front-end
  const currentCount = req.body.commentInfo.currentLikesOrDislikes;
  const type = req.body.commentInfo.type;

  try {
    var updatedComment = "";
    if (type === "like") {
      const newLikes = currentCount + 1; // Increment like count

      updatedComment = await PostsStructure.findByIdAndUpdate(
        { _id: blogId },
        { $set: { "comments.$[outer].likeCount": newLikes } },
        {
          arrayFilters: [{ "outer._id": commentId }],
          new: true,
          projection: {
            comments: {
              $elemMatch: {
                _id: commentId,
              },
            },
          },
        }
      );
    } else if (type === "dislike") {
      const newDislikeCount = currentCount - 1;
      updatedComment = await PostsStructure.findByIdAndUpdate(
        blogId,
        { $set: { "comments.$[outer].dislikeCount": newDislikeCount } },
        {
          arrayFilters: [{ "outer._id": commentId }],
          new: true,
          projection: {
            comments: {
              $elemMatch: {
                _id: commentId,
              },
            },
          },
        }
      );
    }

    res.send(updatedComment);
  } catch (err) {
    res
      .status(500)
      .send("Error updating like count for comment with ID: " + commentId);
    console.log(err);
  }
});

// app.put("/updateDislike", async (req, res) => {
//   const blogId = req.body.id;

//   const id = req.body.comments.id;
//   const newdislikeCount = req.body.comments.dislikeCount;

//   try {
//     const put = await PostsStructure.findOne({ title: title });
//     const comment = put.comments.id(id);
//     comment.dislikeCount = newdislikeCount;
//     await put.save();

//     res.send("updated");
//   } catch (err) {
//     console.log(err);
//   }
// });

app.get("/getContent", async (req, res) => {
  try {
    const createdContent = await PostsStructure.find({}).sort({
      date: -1,
    });
    res.send(createdContent);
  } catch (error) {
    console.log("Error fetching ", error);
    res.send(error);
  }
});
