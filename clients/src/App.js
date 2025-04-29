import "./App.css";
import { useState, useEffect, useRef } from "react";
import Axios, { all } from "axios";
import BlogPost from "./components/BlogPost";
import CreateContent from "./components/CreateContent";
import {faSpinner} from "@fortawesome/free-solid-svg-icons"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Routes,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { Routes, Route } from 'react-router-dom'

function App() {
  const API_URL = `${process.env.REACT_APP_API_URL}/getContent`;

  /*
    Fetching our data and storing in a list state
  */
  const [allContent, setFetchedContent] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  //changing the states based on the fields
  const [createTrigger, setTrigger] = useState(false);
  const createContentRef = useRef(null);

  // Function to toggle the trigger state
  const changeTrigger = () => {
    setTrigger(!createTrigger); // Toggle the trigger state
  };

  // useEffect to handle scrolling when the trigger changes
  useEffect(() => {
    if (createContentRef.current) {
      createContentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [createTrigger]); // Dependency on createTrigger stage change

  useEffect(() => {
    setIsDataLoading(true);
    Axios.get(API_URL)
      .then((response) => {
        setFetchedContent(response.data); //data is sorted in the BE and sent here
        console.log("Fetched data from server");
      })
      .catch((error) => {
        console.log("Error fetching data from server: " + error);
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send("Hello from the client!");
    };
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log("FE: Received data from WebSocket", newData);

      if (newData.operationType === "insert") {
        const newDocument = newData.fullDocument;
        setFetchedContent((prevContent) => {
          return [newDocument, ...prevContent];
        });
      } else if (newData.operationType === "update") {
        // Handle the new comment
        const newComment = newData.newComment;
        const parentDocumentKey = newData.parentDocumentKey; // Get the post ID to which the comment belongs

        console.log("NEW COMMENT", newComment, "KEYY:", parentDocumentKey);
        setFetchedContent((prevContent) => {
          return prevContent.map((post) => {
            if (post._id === parentDocumentKey) {
              console.log("MATCHED ID");

              // Match the post ID
              // Add the new comment to the comments array for the matched post
              return {
                ...post,
                comments: [newComment, ...post.comments], // Append the new comment
              };
            }
            return post; // Return the existing post if it doesn't match
          });
        });
      }
    };

    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    return () => {
      ws.close();
      console.log("WebSocket connection closed");
    };
  }, []);

  return (
    <Router>
      <div className="container" ref={createContentRef}>
        <div>
          <nav className="navbar">
            <div className="innerBar">
              <div className="reviewFest">
                <img src="./official_logo.png" />
              </div>
              <div className="navDescription">
                <p>Share and discover insightful blog posts.</p>
              </div>

              <div className="createRightSide">
                <button
                  onClick={changeTrigger}
                  className="min-w-[5rem] max-w-[5rem] text-center py-[.5rem]"
                >
                  {createTrigger ? "Hide" : "Create"}
                </button>
              </div>
            </div>
          </nav>
        </div>
        <div>
          {createTrigger ? <CreateContent /> : ""}

          {isDataLoading ? <div className="flex justify-center items-center">
            <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
          </div> : ""}
          
          <div>
            {allContent.length === 0 ? (
              <div className="flex items-center justify-center">
                <p className="text-[#2c5282] bg-[#e6f0ff] font-bold py-2 px-4 my-10  rounded">
                  No posts yet, hit{" "}
                  <button
                    className="bg-[#e6f0ff] text-[#2c5282] p-0 font-bold cursor-pointer underline border-none"
                    onClick={changeTrigger}
                  >
                    Create
                  </button>{" "}
                  from above to be the first!{" "}
                </p>
              </div>
            ) : (
              <div>
                {allContent.map((val, key) => {
                  return <BlogPost blog={val} key={key} />;
                })}
              </div>
            )}
          </div>
        </div>

        <footer className="footer py-[.1rem]">
          <p>
            &copy; {new Date().getFullYear()} Created by{" "}
            <a
              href="https://www.linkedin.com/in/hermontes/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hermon Haile
            </a>
          </p>
        </footer>

        <Routes>
          <Route path="/create" Component={CreateContent}>
            {" "}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
