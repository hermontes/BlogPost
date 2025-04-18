import React, { memo, useState, useEffect, useMemo, useRef } from "react";
import CreateComments from "./CreateComments";
import CommentCards from "./CommentCards";

import "./styling/ArticleContent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

const SingleBlog = memo(({ blog }) => {
  const [viewComments, setView] = useState(false);
  const [viewContent, setViewContent] = useState(false);
  const articleRef = useRef(null);

  // console.log("SingleBlog component rendered");
  const toggleContent = () => {
    setViewContent(!viewContent);
    if(viewContent) {
      // Scroll to the article title when "Show Less" is clicked(viewContent is true)
      articleRef.current.scrollIntoView({ behavior: "smooth" }); 
    }
  };

  const contentPreview = blog.content.slice(0, 350) + "...";

  const formatDateAndTime = (givenDateAndTime) => {
    const dateCreated = new Date(givenDateAndTime).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const timeCreated = new Date(givenDateAndTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return { dateCreated, timeCreated };
  };

  const changeViewComment = () => {
    setView(!viewComments);
  };

  return (
    <div className="contentCard" ref={articleRef}>
      <h1 className="blogTitle" >
        <span>{blog.title}</span>
      </h1>
      <div className="authorAndDate">
        <span className="blogAuthor">By {blog.author} </span>{" "}
        <div className="blogDate">
          {" "}
          {formatDateAndTime(blog.date).dateCreated} at{" "}
          {formatDateAndTime(blog.date).timeCreated}
        </div>
      </div>

      <img
        className="blogImage"
        alt={`Image for ${blog.title}`}
        src={blog.image}
      ></img>

      <div className="contentWrapper">
        <div className={viewContent ? "content-expanded" : "content-collapsed"}>
          <p className="contentText">
            {viewContent ? blog.content : contentPreview}
          </p>
        </div>
        <div className="expandContent">
          <button
            className="expandContentButton"
            onClick={toggleContent}
            aria-expanded={viewContent}
          >
            {viewContent ? (
              <>
                {"Show Less "}
                <FontAwesomeIcon icon={faAngleUp} />
              </>
            ) : (
              <>
                {"Show More "} <FontAwesomeIcon icon={faAngleDown} />
              </>
            )}
          </button>
        </div>
      </div>
      <div
        className={
          viewComments
            ? "viewCommentsButton collapsedComment "
            : "viewCommentsButton"
        }
      >
        <button onClick={changeViewComment} value={viewComments}>
          {viewComments ? "Hide Comments" : "View Comments"}
        </button>
      </div>

      {viewComments ? (
        <div className="commentSection">
          <h2>Comments</h2>

          <CreateComments blogPost={blog} />
          <CommentCards
            blog={blog}
            formatDateAndTimeFunction={formatDateAndTime}
          />
        </div>
      ) : null}
    </div>
  );
});

export default SingleBlog;
