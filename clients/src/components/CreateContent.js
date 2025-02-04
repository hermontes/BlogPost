import React from "react";
import Axios from "axios";
import { useState } from "react";
import "./styling/CreateContent.css";

const CreateContent = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [submitOrNot, setSubmit] = useState(false);

  /* Sending POST request to my server containing an object with all the states */
  const sendNewContent = () => {
    const returnErr = Axios.post("http://localhost:3001/createContent", {
      title: title,
      content: content,
      author: author,
      image: image,
      comments: [],
    });

    // clearing the values after submission
    setTitle("");
    setAuthor("");
    setContent("");
    setImage("");
  };

  const formValidation = () => {
    if (
      title.length === 0 ||
      author.length === 0 ||
      content.length === 0 ||
      image.length === 0
    ) {
      setSubmit(true);
    } else {
      setSubmit(false);

      sendNewContent();
    }
  };
  return (
    <div className="horiz">
      {/* <h2>Create a Blog Post:</h2> */}

      {/* <form id="contentForm"> */}
      <form>
        <label>Title:</label>
        <input
          className="contentInput"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>

        <label>Author:</label>
        <input
          className="contentInput"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        ></input>

        <div className="horiz">
          <label for="image">Image URL:</label>
          <input
            className="contentInput"
            name="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></input>
        </div>

        <div className="horizContent">
          <label className="content">Content:</label>
          <textarea
            className="contentBox"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {submitOrNot ? (
          <div className="submissionWarning">At least one field is missing</div>
        ) : (
          ""
        )}
      </form>
      <button className="contentButton" onClick={formValidation}>
        Launch blog
      </button>
      {/* </form> */}
    </div>
  );
};

export default CreateContent;
