import React from "react";
import Axios from "axios";
import "./styling/CommentCards.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'; // Import icons

const CommentCards = ({ blog }) => {

  const handleLike = (commentId, currentLikes) => {
    const newLikes = currentLikes + 1; // increment the like count

    Axios.put("http://localhost:3001/updateLike", {
      title: blog.title,
      comments: { id: commentId, likeCount: newLikes },
    });

    // Update the state with the new like count
    // ...
  };
  const handleDislike = (commentId, currentDislikes) => {
    const newDislikes = currentDislikes + 1; // increment the like count

    Axios.put("http://localhost:3001/updateDislike", {
      title: blog.title,
      comments: { id: commentId, dislikeCount: newDislikes },
    });

    // Update the state with the new like count
    // ...
  };
  return (
    <div>
      {blog.comments.length === 0
        ? ""
        : blog.comments.map((comment, index) => {
            return (
              <div className="commentCard" key={index}>
                <div className="userImage">
                  <img src="/defaultUser.png" alt="Default profile for a user"></img>
                  <div className="commentAuthor">{comment.author}</div>
                </div>

                <div className="commentDate">
                  {" "}
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>

                <p className="commentText">{comment.text}</p>

                <div className="likeDislike">
                  {/* <a href="https://www.flaticon.com/free-icons/like" title="like icons">Like icons created by Gregor Cresnar - Flaticon</a> */}

                  {/* updateLike(comment._id, comment.likeCount) */}

                  <button
                    onClick={() => handleLike(comment._id, comment.likeCount)}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <span className="commentText">{" "}{comment.likeCount}{"  "}</span>
                  <button
                    onClick={() => handleDislike(comment._id, comment.dislikeCount)}
                  > <FontAwesomeIcon icon={faThumbsDown} /> 
                  </button>         {" "}        <span className="commentText">{comment.dislikeCount}</span>
                </div>
                {/* <hr/> */}
                              </div>
            );
          })}
    </div>
  );
};

export default CommentCards;
