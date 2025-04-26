import React, { useState, useEffect, useRef } from "react"; // Added useEffect import
import Axios from "axios";
// Import the updated CSS file:
import "./styling/CreateContent.css";
import "./styling/SharedStyles.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css'; //css for snow theme

const CreateContent = () => {
  //Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  //RTE states
  const [validContentLength, setValidContentLength] = useState(false);
  const [rtePlainTextLength, setRtePlainTextLength] = useState(0)

  //Image file capture states
  const [imageFile, setImageFile] = useState();
  const [isFileValid, setIsFileValid] = useState(true);

  //Submission status fields
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    isError: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  

  //Fields for input validation logic
  const ERROR_MESSAGE = "Failed to create post. Please try again."
  const SUCCESS_MESSAGE = "Blog post created successfully!"

  const MIN_TITLE_LENGTH = 10;
  const MAX_TITLE_LENGTH = 80;
  const MAX_AUTHOR_LENGTH = 40;
  const MIN_CONTENT_LENGTH = 350;
  const MAX_CONTENT_LENGTH = 4000;

  const handleImageChange = (e) => {
    const file = e.target.files[0];    
    if(file){
      console.log(file.type)
      if(file.type === "image/png" || file.type === "image/jpeg") {
        setImageFile(e.target.files[0]);
        setIsFileValid(true)
      } else {
        setIsFileValid(false)
        setImageFile(null)
      }
    }
  }

  const handleTitleChange = (e) => {
    if (e.target.value.length <= MAX_TITLE_LENGTH) {
      setTitle(e.target.value);
    }
  };

  const handleAuthorChange = (e) => {
    if (e.target.value.length <= MAX_AUTHOR_LENGTH) {
      setAuthor(e.target.value);
    }
  };

  const handleContentChange = (content, delta, source, editor) => {
    //set length to be of the plain text
    setRtePlainTextLength(editor.getText().trim().length)
    console.log("plain text:: ", content);
    if (rtePlainTextLength >= MIN_CONTENT_LENGTH && rtePlainTextLength <= MAX_CONTENT_LENGTH) {
      setValidContentLength(true);
    } else {
      setValidContentLength(false);
    }
    setContent(content); // saves the rich text content with HTML
  };

  // Check if all fields are filled whenever any field changes
  const isFormValid =
    title.trim() && author.trim() && validContentLength && isFileValid && imageFile && content;

  // Disable if form invalid, file invalid or in process of submitting
  const preventSubmission = !isFormValid || isSubmitting

  const sendNewContent = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (preventSubmission) return; // Prevent submission if invalid or already submitting

    setIsSubmitting(true); // Indicate submission start
    setSubmissionStatus({ message: "", isError: false }); // Clear previous status

    const formData = new FormData()
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("comments", JSON.stringify([]));
    formData.append("image", imageFile);

    
    try {
      const response = await Axios.post(`${process.env.REACT_APP_API_URL}/createContent`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Sent data and got response: " + response.data);
      setSubmissionStatus({
        message: SUCCESS_MESSAGE,
        isError: false,
      });

      // Clear the form fields after successful submission
      setTitle("");
      setAuthor("");

      //clear RTE
      setValidContentLength(false)
      setContent("");

      //clear the file we previously captured and its input field
      setImageFile(null) 
      document.getElementById('image').value = ''

    } catch (error) {
      console.error("Error sending content:", error);
      setSubmissionStatus({
        message: ERROR_MESSAGE,
        isError: true,
      });
    } finally {
      setIsSubmitting(false); // Indicate submission end
    }
  };

  // Hide status success message after a delay
  useEffect(() => {
    if(submissionStatus.message) {
      const timer = setTimeout( () => setSubmissionStatus({ message: "", isError: false}), 3000)
      return () => clearTimeout(timer)
    }
  },[submissionStatus.message])

  return (
    <div className="create-content-container">
      <h2>Create New Blog Post</h2>

      <form onSubmit={sendNewContent} className="create-content-form" encType="multipart/form-data">

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title" 
            className="form-input" 
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
            minLength={MIN_TITLE_LENGTH}
            maxLength={MAX_TITLE_LENGTH}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            className="form-input"
            type="text"
            value={author}
            onChange={handleAuthorChange}
            required
            maxLength={MAX_AUTHOR_LENGTH}
          />
        </div>

        <div className="form-group-image">
          <label htmlFor="image">Upload Image:</label>
          <label htmlFor="image" className="upload-icon-wrapper">

            <div className="form-group-image-upload">

                <FontAwesomeIcon className="upload-icon" icon={faUpload} />
              
                <input
                  id="image"
                  className="form-input-file-upload"
                  type="file" 
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg"
                  required
                />

            </div>
          </label>


        </div>

        {!isFileValid && 
            <div className="file-error-message">
                Invalid file type. Please upload a PNG/JPEG image only.
            </div>
        }

        <div className="form-group">


          {/* RTE */}
          <label htmlFor="quillRTE">
            Content: 
            
          </label>

          <div>

            <ReactQuill 
              className="rich-text-box" 
              id="quillRTE" 
              placeholder={"Write content for your blog..."} 
              value={content} 
              onChange={handleContentChange} 
              required 
            />

          </div>
          {rtePlainTextLength > 0 && rtePlainTextLength < MIN_CONTENT_LENGTH ?
          <div className="alert-content-length">
            <p>At least 350 characters required: {" "}({rtePlainTextLength}/{MIN_CONTENT_LENGTH})</p>
          </div>
          : ""}
        </div>

        {/* Display Submission Status */}
        {submissionStatus.message && (
          <div
            className={`submission-status ${
              submissionStatus.isError ? "error" : "success"
            }`}
          >
            {submissionStatus.message}
          </div>
        )}

        <button
          type="submit" 
          className="submit-button" 
          disabled={preventSubmission} // Disable if form invalid, file invalid or in process of submitting
        >
          {isSubmitting ? "Submitting..." : "Launch Blog Post"}
        </button>

      </form>
    </div>
  );
};

export default CreateContent;
