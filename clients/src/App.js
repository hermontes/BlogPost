import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import BlogPost from "./components/BlogPost";
import CreateContent from "./components/CreateContent";

// import { Routes, Route } from 'react-router-dom'

function App() {
  //changing the states based on the fields

  const [allContent, setFetchedContent] = useState([]);

  const [createTrigger, setTrigger] = useState(false);
  /*
    Fetching our data and storing in a list state
  */
  const changeTrigger = () => {
    setTrigger(!createTrigger);
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/getContent").then((response) => {
      setFetchedContent(response.data);
    });
  }, []);

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
