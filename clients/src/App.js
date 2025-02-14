import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import BlogPost from "./components/BlogPost";
import CreateContent from "./components/CreateContent";

// import { Routes, Route } from 'react-router-dom'

function App() {
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
    try{
      Axios.get("http://localhost:3001/getContent").then((response) => {
        setFetchedContent(response.data);
      });
    } catch {
      console.log("Error fetching data");
    }
    
  }, []);
  //you know there is a new entry once I have successfully submitted one

  const sortedContent = allContent.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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
        {createTrigger ? <CreateContent /> : ""}

        <>
          {sortedContent.map((val, key) => {
            return <BlogPost blog={val} key={key} />;
          })}
        </>
      </div>
    </div>
  );
}

export default App;
