import React, { memo, useState, useEffect, useMemo } from "react";
import CreateComments from "./CreateComments";
import CommentCards from "./CommentCards";

import "./styling/ArticleContent.css";
import { counter } from "@fortawesome/fontawesome-svg-core";

const SingleBlog = memo(({ blog, setterForNewContent}) => {
  const [viewComments, setView] = useState(false);

  const formatDateAndTime = (givenDateAndTime) => {
    const dateCreated = new Date(givenDateAndTime).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    
    const timeCreated = new Date(givenDateAndTime).toLocaleTimeString("en-US", { 
       hour: "numeric", 
       minute: "numeric", 
       hour12: true
    })

    return { dateCreated , timeCreated}
  }

  const changeViewComment = () => {
    setView(!viewComments);
  };

  return (
    <div className="contentCard">
      <h1 className="blogTitle">
        <span>{blog.title}</span>
      </h1>
      <div className="authorAndDate">
        <span className="blogAuthor">By {blog.author} </span>{" "}
        <div className="blogDate">
          {" "}
          {formatDateAndTime(blog.date).dateCreated} at {formatDateAndTime(blog.date).timeCreated}
        </div>
      </div>

      <img
        className="blogImage"
        alt={`Image for ${blog.title}`}
        src={blog.image}
      ></img>

      <p className="contentText">{blog.content}</p>

      <div className="viewCommentsButton">
        <button onClick={changeViewComment} value={viewComments}>
          {viewComments ? "Hide Comments" : "View Comments"}
        </button>
      </div>

      {viewComments ? (
        <div className="commentSection">
          <h2>Comments</h2>
          <hr />
          <CreateComments blogPost={blog} fetchNewContentAfterNewComment={setterForNewContent} />
          <CommentCards blog={blog} formatDateAndTimeFunction={formatDateAndTime}/>
        </div>
      ) : null}

      <hr className="separator"></hr>
    </div>
  );
});

export default SingleBlog;
