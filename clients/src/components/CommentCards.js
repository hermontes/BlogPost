import { React, useMemo } from "react";
import Axios from "axios";
import "./styling/CommentCards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons"; // Import icons

const CommentCards = ({ blog, formatDateAndTimeFunction }) => {
  const sortedComments = useMemo(() => {
    return [...blog.comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [blog.comments]);

  // Updating like and dislike counts
  const handleLikeAndDislikes = (type, commentId, currentLikesOrDislikes) => {
    Axios.put("http://localhost:3001/updateLikeOrDislike", {
      id: blog._id,
      commentInfo: {
        id: commentId,
        type: type,
        currentLikesOrDislikes: currentLikesOrDislikes,
      },
    })
      .catch((error) => {
        console.log("received back an error: ", error);
      })
      .then((response) => {
        if (response) {
          console.log("RECEIVED BACK: ", response.data.comments[0]);
        }
      });
  };

  return (
    <div className="comments-container">
      {sortedComments.length === 0
        ? ""
        : sortedComments.map((comment, index) => {
            return (
              <div className="comment-card" key={index}>
                <div className="comment-left">
                  <img
                    src="/defaultUser.png"
                    alt="Default profile for a user"
                    className="profile-pic"
                  />
                </div>
                <div className="comment-right">
                  <div className="comment-header">
                    <span className="author">{comment.author}</span>
                    <span className="date">
                      {formatDateAndTimeFunction(comment.createdAt).dateCreated}{" "}
                      at{" "}
                      {formatDateAndTimeFunction(comment.createdAt).timeCreated}
                    </span>
                  </div>
                  <div className="comment-text"><p>{comment.text}</p></div>
                  <div className="actions">
                    <div className="action-button">
                      <button
                        onClick={() =>
                          handleLikeAndDislikes(
                            "like",
                            comment._id,
                            comment.likeCount
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>{comment.likeCount}</span>
                      </button>
                    </div>
                    <div className="action-button">
                      <button
                        onClick={() =>
                          handleLikeAndDislikes(
                            "dislike",
                            comment._id,
                            comment.dislikeCount
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faThumbsDown} />
                        <span>{comment.dislikeCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default CommentCards;
