import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [eventTest, setEventTest] = useState("yo");
  const [fileToBeSent, setFileToBeSent] = useState();

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  function uploadFile(e) {
    e.preventDefault();
    let file = fileToBeSent;
    const formData = new FormData();
    
    formData.append("file", file);
    formData.append("exclude", JSON.stringify(
      {start: "23:00", end: "06:30"}
    ));
    formData.append("tasks", JSON.stringify([
      {name: "Task 1", duration: 1},
      {name: "Task 2", duration: 2},
    ]));
    formData.append("startDate", JSON.stringify({year: 2023, month: 9, day: 13}));
    formData.append("endDate", JSON.stringify({year: 2023, month: 9, day: 15}));
  
    fetch("/schedule", {
      method: "POST",
      body: formData,
    }).then(res => res.json())
      .catch(err => console.warn(err))
      .then(data => {
        setEventTest("after"); // TODO: data.schedule
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>The current time is {currentTime}.</p>
        <p>free time blocks: {eventTest}.</p>
      </header>
      <input type="file" name="file" onChange={(e) => setFileToBeSent(e.target.files[0])}/>
      <button onClick={uploadFile}>
          Upload 
      </button>
    </div>
  );
}

export default App;