
import React, { useState, useEffect } from "react"; // Added useEffect import
import Axios from "axios";
// Import the updated CSS file:
import "./styling/CreateContent.css";

const CreateContent = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    isError: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  // Check if all fields are filled whenever any field changes
  const isFormValid = title.trim() && author.trim() && content.trim() && image.trim();

  const sendNewContent = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!isFormValid || isSubmitting) return; // Prevent submission if invalid or already submitting

    setIsSubmitting(true); // Indicate submission start
    setSubmissionStatus({ message: "", isError: false }); // Clear previous status

    try {
      const response = await Axios.post("http://localhost:3001/createContent", {
        title: title,
        content: content,
        author: author,
        image: image,
        comments: [], // Assuming default empty comments array
      });

      console.log("Sent data and got response: " + response.data);
      setSubmissionStatus({ message: "Blog post created successfully!", isError: false });

      // Clear the form fields after successful submission
      setTitle("");
      setAuthor("");
      setContent("");
      setImage("");

      // Optional: Hide success message after a delay
      setTimeout(() => setSubmissionStatus({ message: "", isError: false }), 3000);

    } catch (error) {
      console.error("Error sending content:", error);
      setSubmissionStatus({
        message: "Failed to create post. Please try again.",
        isError: true,
      });
    } finally {
      setIsSubmitting(false); // Indicate submission end
    }
  };

  return (
    // Use a more descriptive class name for the container
    <div className="create-content-container">
      <h2>Create New Blog Post</h2>
      {/* Use onSubmit on the form element */}
      <form onSubmit={sendNewContent} className="create-content-form">
        {/* Wrap label and input pairs in divs */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title" // Match label's htmlFor
            className="form-input" // Use a consistent class for inputs
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required // Add basic HTML5 validation
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            className="form-input"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            id="image"
            className="form-input"
            type="url" // Use type="url" for better semantics/validation
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            className="form-textarea" // Specific class for textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8" // Suggest initial height
            required
          ></textarea>
        </div>

        {/* Display Submission Status */}
        {submissionStatus.message && (
          <div className={`submission-status ${submissionStatus.isError ? 'error' : 'success'}`}>
            {submissionStatus.message}
          </div>
        )}

        {/* Place button inside the form */}
        <button
          type="submit" // Use type="submit"
          className="submit-button" // New class name
          disabled={!isFormValid || isSubmitting} // Disable if form invalid or submitting
        >
          {isSubmitting ? "Submitting..." : "Launch Blog Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateContent;