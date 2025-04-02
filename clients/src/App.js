import "./App.css";
import { useState, useEffect } from "react";
import Axios, { all } from "axios";
import BlogPost from "./components/BlogPost";
import CreateContent from "./components/CreateContent";


// import { Routes, Route } from 'react-router-dom'

function App() {
  const API_URL = "http://localhost:3001/getContent"
  /*
    Fetching our data and storing in a list state
  */
  const [allContent, setFetchedContent] = useState([]);

  //changing the states based on the fields
  const [createTrigger, setTrigger] = useState(false);

  const changeTrigger = () => {
    setTrigger(!createTrigger);
  };

  useEffect(() => {
    Axios.get(API_URL)
      .then((response) => {
        const sortedData = response.data.sort((a,b) => new Date(b.date) - new Date(a.date));
        setFetchedContent(sortedData);
        console.log("Fetched data from server");
        // Reset the state to false after fetching
      })
      .catch((error) => {
        console.log("Error fetching data from server: " + error);
      });
  }, []);

  useEffect( () => {
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send("Hello from the client!");
    }
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log("Received data from WebSocket:", newData);
      
      if(newData.operationType === "insert") {
        const newDocument = newData.fullDocument
        setFetchedContent((prevContent) => {
          return [newDocument, ...prevContent];
        });
      }
      }

    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    } 

    return () => {
      ws.close();
      console.log("WebSocket connection closed");
    }
  }, []);


  // const sortedContent =() => {
  //   return [...allContent].sort((a, b) => new Date(b.date) - new Date(a.date));
  // };

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
          <CreateContent />
        )}
        <div>
          {allContent.map((val, key) => {
            return (
              <BlogPost
                blog={val}
                key={val._id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
