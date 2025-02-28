import {React , useMemo} from "react";
import Axios from "axios";
import "./styling/CommentCards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons"; // Import icons

const CommentCards = ({ blog, formatDateAndTimeFunction }) => {
  const handleLike = (commentId, currentLikes) => {
    const newLikes = currentLikes + 1; // increment the like count

    Axios.put("http://localhost:3001/updateLike", {
      title: blog.title,
      comments: { id: commentId, likeCount: newLikes },
    });

    // Update the state with the new like count
    // ...
  };

  const sortedComments = useMemo(() => {
    return [...blog.comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [blog.comments]);

  const handleDislike = (commentId, currentDislikes) => {
    const newDislikes = currentDislikes + 1; // increment the like count

    Axios.put("http://localhost:3001/updateDislike", {
      title: blog.title,
      comments: { id: commentId, dislikeCount: newDislikes },
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
                  {formatDateAndTimeFunction(comment.createdAt).dateCreated}{" "}
                  at{" "}
                  {formatDateAndTimeFunction(comment.createdAt).timeCreated}
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
                  <span className="commentText">
                    {" "}
                    {comment.likeCount}
                    {"  "}
                  </span>
                  <button
                    onClick={() =>
                      handleDislike(comment._id, comment.dislikeCount)
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
