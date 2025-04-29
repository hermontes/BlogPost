import React, { memo, useState, useRef } from "react";
import CreateComments from "./CreateComments";
import CommentCards from "./CommentCards";
import { CalculateReadTime } from "./ReusableComponents"
import { formatDateAndTime } from "../utils/DateUtils";
import DOMPurify from 'dompurify'

import "./styling/ArticleContent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

const SingleBlog = memo(({ blog }) => {
  const [viewComments, setView] = useState(false);
  const [viewContent, setViewContent] = useState(false);
  const articleRef = useRef(null);

  const sanitizedContent = DOMPurify.sanitize(blog.content);
  const contentPreview = sanitizedContent.trim().slice(0, 350) + "...";

  const toggleContent = () => {
    setViewContent(!viewContent);
    if (viewContent) {
      // Scroll to the article title when "Show Less" is clicked(viewContent is true)
      articleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const changeViewComment = () => {
    setView(!viewComments);
  };

  return (
    <div className="contentCard" ref={articleRef}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="blogTitle">
            <span>{blog.title}</span>
          </h1>
        </div>
        <div>
            <p className="text-[#6b7280]">
              <CalculateReadTime content={sanitizedContent} /> 
            </p>
        </div>
      </div>
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
        alt={`${blog.title}`}
        src={blog.image}
      ></img>

      <div className="contentWrapper">
        <div className={viewContent ? "content-expanded" : "content-collapsed"}>
          <article>
            <p className="contentText">
            {viewContent ?
              <div dangerouslySetInnerHTML={{__html: sanitizedContent} }/> 
              :
              <div dangerouslySetInnerHTML={{__html: contentPreview} }/> 
            }
            </p>
          </article>
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
                {"Read More "} <FontAwesomeIcon icon={faAngleDown} />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="commentSection">
        <CreateComments blogPost={blog} />

        {blog.comments.length > 0 && (
          <div>
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

            {viewComments && (
              <div className="commentsList">
                <CommentCards
                  blog={blog}
                  formatDateAndTimeFunction={formatDateAndTime}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default SingleBlog;
