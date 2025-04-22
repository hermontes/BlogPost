const express = require("express");
const mongoose = require("mongoose");
const app = express(); //initializes an Express application.
const cors = require("cors");
const PostsStructure = require("./models/PostsStructure");
require("dotenv").config();

const WebSocket = require("ws");
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const websocketServer = new WebSocket.Server({ server });

const clients = new Set();
let dbChangesListener = null;

//Starts watching the DB for changes
function startWatchingDB() {
  //if we already started listening to DB changes, just return
  if(dbChangesListener) return;

  dbChangesListener = PostsStructure.watch();

  dbChangesListener.on("change", (change) => {
    if (change.operationType === "insert" ) {
      const newChanges = {
        operationType: change.operationType,
        fullDocument: change.fullDocument,
      };
      console.log("Change detected:", change);
      // instanceOfWebSocket.send(JSON.stringify(newChanges));
      clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN) {
          try{
            client.send(JSON.stringify(newChanges));
          }catch(error) {
            console.log("Error sending new post to client:", error);
            clients.delete(client)
          }
        }
      })
    }

    if (change.operationType === "update") {
      // Check if the update is for comments
      const listOfUpdatedFields = change.updateDescription.updatedFields;
      const isLikeDiscountCommentUpdate = Object.keys(listOfUpdatedFields).some(key => key.includes('dislikeCount') || key.includes("likeCount") || key.includes("updatedAt"));

      //Only handle new comment(s) updates, not like or discount updates
      if (!isLikeDiscountCommentUpdate) {
        console.log("SINNER")
        console.log("info", listOfUpdatedFields)
        const updatedCommentKey = Object.keys(listOfUpdatedFields)[0]; // e.g., 'comments.19'
        var newComment = listOfUpdatedFields[updatedCommentKey];
        //the very first time, its an array that contains the comment
        if(Array.isArray(newComment)) {
          //extracting the actual comment which would be the first time
          newComment = newComment[0];
        }
        const parentDocumentKey = change.documentKey._id;
        

        console.log("comment fix:", newComment)
        const commentChange = {
          parentDocumentKey: parentDocumentKey,
          operationType: "update",
          newComment: newComment,
        };

        clients.forEach((client) => {
          // console.log("sending to: ", client)
          if(client.readyState === WebSocket.OPEN) {
            try{
              client.send(JSON.stringify(commentChange));
            } catch(error) {
              console.log("Error sending comment to client:", error);
              clients.delete(client)
            }
          }
        })

        // instanceOfWebSocket.send(JSON.stringify(commentChange)); // Send the new comment to the client
      }
    }
  });

}

// WebSocket connection
websocketServer.on("connection", (instanceOfWebSocket) => {

  console.log("Client connected");
  clients.add(instanceOfWebSocket)
  if(dbChangesListener === null) {
    startWatchingDB();
  }

  console.log("Client set size: ", clients.size);


  // Receiving client messages
  instanceOfWebSocket.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  instanceOfWebSocket.on("close", () => {
    console.log("Client disconnected");
    clients.delete(instanceOfWebSocket)
    console.log("Client set size: ", clients.size);

    //close DB listener when all clients are disconnected
    if(clients.size === 0 && dbChangesListener != null) {
      dbChangesListener.close();
      dbChangesListener = null;
    }
  });
});

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
  ? process.env.PROD_ORIGIN
  : process.env.DEV_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// To parse incoming JSON data
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(" MongoDB connection error:", err);
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

  const {id: blogId, commentInfo} = req.body
  const {id: commentId, type, previousAction, isFirstAction, currentCount} = commentInfo

  try {
    let update = {};

    if (type === "like") {

      if(isFirstAction) {
        update = {
          $inc: {
            "comments.$[outer].likeCount": 1
          }
        };
      } else if(previousAction === "dislike") {
        // Switching from dislike to like, increment like, decrement dislike count

        update = {
          $inc: {
            "comments.$[outer].likeCount": 1,
            "comments.$[outer].dislikeCount": 1
          }
        };      
      } 
    } else if (type === "dislike") {

      if(isFirstAction) {
        update = {
          $inc: {
            "comments.$[outer].dislikeCount": -1
          }
        };

      } else if(previousAction === "like") {

        // Switching from dislike to like, decrement like, increment dislike count
        update = {
          $inc : {
            "comments.$[outer].dislikeCount": -1,
            "comments.$[outer].likeCount": -1
          }

        };      
      } 
    }

    // Only proceed if there's an update to make
    if (Object.keys(update).length > 0) {
      const updatedComment = await PostsStructure.findOneAndUpdate(
        { _id: blogId },
        update,
        {
          arrayFilters: [{ "outer._id": commentId }],
          new: true,
          projection: {
            comments: {
              $elemMatch: { _id: commentId }
            }
          }
        }
      );

      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      console.log("sending back updated comment:", updatedComment)
      res.json(updatedComment);
    } 
    
  } catch (err) {
    res
      .status(500)
      .send("Error updating like/dislike count for comment with ID: " + commentId);
    console.log(err);
  }
});


app.get("/getContent", async (req, res) => {
  try {
    const createdContent = await PostsStructure.find({}).sort({
      date: -1,
    });
    res.setHeader('Content-Type', 'application/json');
        
    // Send JSON response
    res.status(200).json(createdContent);
  } catch (error) {
    console.log("Error fetching ", error);
    res.status(500).json({ 
      error: 'Failed to fetch content',
      message: error.message 
    });
  }
});
