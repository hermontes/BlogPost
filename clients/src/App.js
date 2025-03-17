import "./App.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import Axios, { all } from "axios";
import BlogPost from "./components/BlogPost";
import CreateContent from "./components/CreateContent";


// import { Routes, Route } from 'react-router-dom'

function App() {
  /*
    Fetching our data and storing in a list state
  */
  const [allContent, setFetchedContent] = useState([]);
  const [isNewContentSaved, setIsNewContentSaved] = useState(false);

  const updateContentSavedState = useCallback((newState) => {
    setIsNewContentSaved(newState);
  }, []);
  //changing the states based on the fields
  const [createTrigger, setTrigger] = useState(false);

  const changeTrigger = () => {
    setTrigger(!createTrigger);
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/getContent")
      .then((response) => {
        setFetchedContent(response.data);
        console.log("Fetched data from server");
        // Reset the state to false after fetching
        setIsNewContentSaved(false);
      })
      .catch((error) => {
        console.log("Error fetching data from server: " + error);
      });
  }, []);
  //you know there is a new entry once I have successfully submitted new content

  useEffect( () => {
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send("Hello from the client!");
    }
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log("Received data from WebSocket:", newData);
      
      // Update the state with the new data
    }

    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    } 

  }, []);


  const sortedContent = useMemo(() => {
    return [...allContent].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allContent]);

  return (
    // <div className="App">
    <div>
      <nav className="navbar">
        <div className="innerBar">
          <div className="reviewFest">
            <span>ReviewFest</span>
          </div>

          <div className="createRightSide">
            <button onClick={changeTrigger}>
              {createTrigger ? "Collapse" : "Create"}
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {createTrigger && (
          <CreateContent setterForNewContent={updateContentSavedState} />
        )}
        <>
          {sortedContent.map((val, key) => {
            return (
              <BlogPost
                blog={val}
                key={key}
                setterForNewContent={updateContentSavedState}
              />
            );
          })}
        </>
      </div>
    </div>
  );
}

export default App;
