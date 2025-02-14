import React from "react";
import { useState } from "react";
import Axios from "axios";

import "./styling/CreateComments.css";
// import './App.css';

const Comments = ({ blogPost }) => {
  const [commentField, setComment] = useState("");
  const [name, setName] = useState("");

  const createComment = () => {
    Axios.put("http://localhost:3001/makeComment", {
      title: blogPost.title,
      comments: {
        name: name,
        text: commentField,
        likeCount: 0,
        dislikeCount: 0,
      },
    });
    // //clearing the values after submission
    setName("");
    setComment("");
  };

  return (
    <div className="createCommentsSection">
      <div className="commentHeading">
        {blogPost.comments.length == 0
          ? blogPost.comments.length + " comments, be the first one!"
          : blogPost.comments.length + " comments, join the conversation!"}
      </div>

      <input
        type="text"
        className="commentInput"
        value={name}
        placeholder="Full Name..."
        onChange={(e) => setName(e.target.value)}
      ></input>

      <div>
        <textarea
          className="commentBox"
          value={commentField}
          placeholder="Share your thoughts..."
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <div className="buttonAlign">
        <button onClick={createComment}>Comment</button>
      </div>
    </div>
  );
};

export default Comments;
