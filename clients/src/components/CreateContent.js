import React from "react";
import Axios from "axios";
import { useState } from "react";
import "./styling/CreateContent.css";

const CreateContent = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  /* Sending POST request to my server containing an object with all the states */
  const sendNewContent = () => {
    Axios.post("http://localhost:3001/createContent", {
      title: title,
      content: content,
      author: author,
      image: image,
      comments: [],
    })
      .then((response) => {
        console.log("sent data and got response: " + response.data);

        // clearing the values after submission
        setTitle("");
        setAuthor("");
        setContent("");
        setImage("");
      })
      .catch((error) => {
        console.log("Sent new content and server sent back an error: " + error);
        // Handle the error as needed
      });
  };

  const formValidation = () => {
    if (
      title.length === 0 ||
      author.length === 0 ||
      content.length === 0 ||
      image.length === 0
    ) {
      setIsFormValid(false);
    } else {
      // set Boolean back to true since all fields are filled in at this point
      setIsFormValid(true);

      // send the data to the server
      sendNewContent();
    }
  };
  return (
    <div className="horiz">
      {/* Form for capturing blog post fields */}
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

        {isFormValid ? (
          ""
        ) : (
          <div className="submissionWarning">At least one field is missing</div>
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
