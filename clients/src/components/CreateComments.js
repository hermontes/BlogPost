import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";

import "./styling/CreateComments.css";
import "./styling/SharedStyles.css";

const Comments = ({ blogPost }) => {
  const [commentField, setComment] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const ERROR_MESSAGE =
    "An error occured while submitting your comment, please try again";
  const SUCCESS_MESSAGE = "Successfully created a comment!";

  const areFieldsFilled = commentField.trim() && name.trim();

  const createComment = (event) => {
    event.preventDefault();

    Axios.put(`${process.env.REACT_APP_API_URL}/makeComment`, {
      _id: blogPost._id,
      comments: {
        name: name,
        text: commentField,
        likeCount: 0,
        dislikeCount: 0,
      },
    })
      .then(() => {
        // //clearing the values after submission
        setName("");
        setComment("");
        setFormError(false);
        setStatusMessage(SUCCESS_MESSAGE);
      })
      .catch((error) => {
        setFormError(true);
        setStatusMessage(ERROR_MESSAGE);
        console.error("Error creating comment:", error);
      });
  };

  //clearing the submit status message after 3 seconds
  useEffect(() => {
    //set timeout and clean it up after
    if(statusMessage) {
      const timer = 
      setTimeout(() => setStatusMessage(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage])


  return (
    <>
      <div className="createCommentsSection">
        <div className="commentHeading">
          {blogPost.comments.length == 0
            ? blogPost.comments.length + " comments, be the first one!"
            : blogPost.comments.length + " comments, join the conversation!"}
        </div>

        <form onSubmit={createComment}>
          <div className="create-comment-fields">
            <input
              type="text"
              className="commentInput"
              value={name}
              placeholder="Full Name..."
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
            ></input>

            <textarea
              className="commentBox"
              value={commentField}
              placeholder="Share your thoughts..."
              onChange={(e) => setComment(e.target.value)}
              maxLength={2000}
              required
            ></textarea>
          </div>
          <div>
            {/* display this section, only if status message is not empty */}
            {statusMessage && (
              <div
                className={`submission-status  ${
                  formError ? "error" : "success"
                }`}
              >
                {statusMessage}
              </div>
            )}
          </div>
          <div className="buttonAlign">
            <button type="submit"> Comment</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Comments;
