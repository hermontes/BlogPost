import { React, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import "./styling/CommentCards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faRegularThumbsUp, faThumbsDown as faRegularThumbsDown} from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faSolidThumbsUp, faThumbsDown as faSolidThumbsDown} from '@fortawesome/free-solid-svg-icons';

const CommentCards = ({ blog, formatDateAndTimeFunction }) => {

  const [comments, setComments] = useState(blog.comments);
  const [actionStatusOfComments, setActionStatusOfComments] = useState({});

  const updateCommentsLikeStatus = (commentId, type) => {
    setActionStatusOfComments(prev => ({
      ...prev,
      [commentId]: {
        type: type,
      }
    }))
  }
  //when blog.comments changes, update the local list of comments too
  useEffect(() => {
    setComments(blog.comments)
  }, [blog.comments])

  const sortedComments = useMemo(() => {
    return [...comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [comments]);

  // Updating like and dislike counts in the DB
  const applyLikeDislikeActions = async(type, commentId, currentCount) => {
    if(actionStatusOfComments[commentId]?.type === type ){
      return;
    }

    console.log("actualling applying likes/dislikes")
    const previousAction = actionStatusOfComments[commentId]?.type || null;

    try {
      const response = await Axios.put(`${process.env.REACT_APP_API_URL}/updateLikeOrDislike`, {
        id: blog._id,
        commentInfo: {
          id: commentId,
          type: type,
          currentLikesOrDislikes: currentCount,
          previousAction, // Will be null on first interaction
          isFirstAction: !previousAction // Helper flag for backend
        },
      })

      if (response?.data?.comments) {
        //Display the immediate like or dislike count change
        const updatedComment = response.data.comments[0];
        console.log("got back updated comment: ", updatedComment)
        setComments((prevComments) => {
          return prevComments.map(comment => {
            if (comment._id === updatedComment._id) {
              return updatedComment
            } else{
              return comment;
            }
          });
        });

        updateCommentsLikeStatus(commentId, type)
      }
      

    } catch (error) {
      console.error("Error updating like/dislike:", error);

    }
  };

  return (
    <div className="comments-container">
      {sortedComments.length === 0
        ? ""
        : sortedComments.map((comment) => {
            return (
              <div className="comment-card" key={comment._id}>
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
                          applyLikeDislikeActions(
                            "like",
                            comment._id,
                            comment.likeCount
                          )                        }
                      >
              <FontAwesomeIcon 
                    icon={actionStatusOfComments[comment._id]?.type === 'like' ? faSolidThumbsUp : faRegularThumbsUp} 
                  />          
              <span>{comment.likeCount}</span>
                      </button>
                    </div>
                    <div className="action-button">
                      <button
                        onClick={() =>
                          applyLikeDislikeActions(
                            "dislike",
                            comment._id,
                            comment.dislikeCount
                          )
                        }
                      >
                        <FontAwesomeIcon 
      icon={actionStatusOfComments[comment._id]?.type === 'dislike' ? faSolidThumbsDown : faRegularThumbsDown} 
    /> 
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
