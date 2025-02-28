import React, { useState } from "react";
import CreateComments from "./CreateComments";
import CommentCards from "./CommentCards";

import "./styling/ArticleContent.css";

const SingleBlog = ({ blog }) => {
  //sorting them by date
  blog.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const [viewComments, setView] = useState(false);

  const dateBlogCreated = new Date(blog.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeBlogCreated = new Date(blog.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

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
          {dateBlogCreated} at {timeBlogCreated}
        </div>
      </div>

      <img className="blogImage" alt={`Image for ${blog.title}`} src={blog.image}></img>

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
          <CreateComments blogPost={blog} />
          <CommentCards blog={blog} />
        </div>
      ) : null}

      <hr className="separator"></hr>
    </div>
  );
};

export default SingleBlog;
