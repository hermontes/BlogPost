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
      commentInfo: { id: commentId, type: type, currentLikesOrDislikes: currentLikesOrDislikes },

    });

  };
  
  return (
    <div>
      {sortedComments.length === 0
        ? ""
        : sortedComments.map((comment, index) => {
            return (
              <div className="commentCard" key={index}>
                <div className="userImage">
                  <img
                    src="/defaultUser.png"
                    alt="Default profile for a user"
                  ></img>
                  <div className="commentAuthor">{comment.author}</div>
                </div>

                <div className="commentDate">
                  {" "}
                  {
                    formatDateAndTimeFunction(comment.createdAt).dateCreated
                  } at{" "}
                  {formatDateAndTimeFunction(comment.createdAt).timeCreated}
                </div>

                <p className="commentText">{comment.text}</p>

                <div className="likeDislike">
                  {/* <a href="https://www.flaticon.com/free-icons/like" title="like icons">Like icons created by Gregor Cresnar - Flaticon</a> */}
                  {/* updateLike(comment._id, comment.likeCount) */}
                  <button
                    onClick={() => handleLikeAndDislikes("like", comment._id, comment.likeCount)}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <span className="commentText">
                    {" "}
                    {comment.likeCount}
                    {"  "}
                  </span>
                  <button
                    onClick={() =>
                      handleLikeAndDislikes("dislike", comment._id, comment.dislikeCount)
                    }
                  >
                    {" "}
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </button>{" "}
                  <span className="commentText">{comment.dislikeCount}</span>
                </div>
                {/* <hr/> */}
              </div>
            );
          })}
    </div>
  );
};

export default CommentCards;
