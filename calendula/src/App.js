import React, { useState, useEffect } from 'react';
import ICalendarLink from "react-icalendar-link";
import Success from './components/Success.js';
import './App.css';
import { Box, Container, Typography, Card, CardActionArea, CardContent, Autocomplete, TextField, Button, Stack, Paper } from '@mui/material';
import Dropzone from 'react-dropzone'
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { lightGreen } from '@mui/material/colors';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { light } from '@mui/material/styles/createPalette.js';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

// One time slot every 30 minutes.
const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) =>
    `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${
      index % 2 === 0 ? '00' : '30'
    }`,
);

function App() {
  const [calendar, setCalendar] = useState();
  const [fileToBeSent, setFileToBeSent] = useState();
  const [taskFields, setTaskFields] = useState([
    { name: '', duration: null },
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [sleepTimeStart, setSleepTimeStart] = useState();
  const [sleepTimeEnd, setSleepTimeEnd] = useState();

  const handleFormChange = (event, index) => {
    let data = [...taskFields];
    data[index][event.target.name] = event.target.value;
    setTaskFields(data);
  }

  const addFields = () => {
    let object = {
      name: '',
      duration: null
    }

    setTaskFields([...taskFields, object])
  }

  const removeFields = (index) => {
    let data = [...taskFields];
    data.splice(index, 1)
    setTaskFields(data)
  }

  useEffect(() => {
  }, []);

  function printState(){
    console.log(taskFields);
    console.log(startDate);
    console.log(endDate);
    console.log(sleepTimeStart);
    console.log(sleepTimeEnd);
    console.log(fileToBeSent[0]);
  }

  function uploadFile(e) {
    e.preventDefault();
    let file = fileToBeSent;
    const formData = new FormData();
    
    formData.append("file", file);
    formData.append("exclude", JSON.stringify(
      {start: sleepTimeEnd, end: sleepTimeStart}
    ));
    formData.append("tasks", JSON.stringify(taskFields));
    formData.append("startDate", JSON.stringify({year: startDate.$y, month: startDate.$M +1, day: startDate.$D}));
    formData.append("endDate", JSON.stringify({year: endDate.$y, month: endDate.$M +1, day: endDate.$D}));
  
    fetch("/schedule", {
      method: "POST",
      body: formData,
    }).then(res => res.blob())
      .catch(err => console.warn(err))
      .then(blob => {
        console.log("got blob");
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'calendar.ics';
        alink.click();
        setCalendar(blob); // TODO: data.schedule
      });
  };

  return (
    <div className="App">
      <div>
      {calendar? 
        <Success/>:
        <Container maxWidth={false}
          style={{
            textAlign: 'center',
            backgroundColor: '#F7F7F7', 
            fontFamily: 'Poppins', 
            fontWeight: '200', 
            width: '100%',
          }}>
            <Box
            style={{
              textAlign: 'center',
              backgroundColor: '#FC9F55', 
              padding: '50px',
            }}>
              <Typography
                style={{
                textAlign: 'center', 
                color: 'white', 
                fontSize: 96, 
                fontFamily: 'Lobster', 
                fontWeight: '400', 
                wordWrap: 'break-word',
              }}
                variant='h1'
              >
                Calendula
              </Typography>
              <Typography
                style={{
                textAlign: 'center', 
                color: 'white', 
                fontSize: 40, 
                fontFamily: 'Poppins', 
                fontWeight: '400', 
                wordWrap: 'break-word',
              }}
                variant='h3'
              >
                Cultivate your Calendar
              </Typography>

              <Card style={{
                width: '80%',
                margin: 'auto',
                backgroundColor: '#F7F7F7',
                marginTop: '40px',
              }}>
                <CardActionArea>
                  <CardContent>
                    <FileUploadIcon sx={{ color: lightGreen[700], fontSize:'80px'}}/>
                    <input type="file" name="file" onChange={(e) => setFileToBeSent(e.target.files[0])}/>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
            <Typography style={{
              color: '#41521F',
              fontFamily: 'Poppins',
              fontWeight: 'bold',
              marginTop: '20px',
              marginBottom: '20px',
              fontSize: '20px',
              textAlign: 'center',
            }}>
              Select a start date for the week you wish to schedule
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Choose a date..."
                  variant="inline"
                  style={{ 
                    width: "100%", 
                    margin:"auto",
                  }}
                  value={startDate}
                  onChange={setStartDate}
                />
            </LocalizationProvider>

            <Typography style={{
              color: '#41521F',
              fontFamily: 'Poppins',
              fontWeight: 'bold',
              marginTop: '20px',
              marginBottom: '20px',
              fontSize: '20px',
              textAlign: 'center',
            }}>
              Select a end date for the scheduling
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Choose a date..."
                  variant="inline"
                  style={{ 
                    width: "100%", 
                    margin:"auto",
                  }}
                  value={endDate}
                  onChange={setEndDate}
                />
            </LocalizationProvider>
            
            <Typography style={{
              color: '#41521F',
              fontFamily: 'Poppins',
              fontWeight: 'bold',
              marginTop: '20px',
              marginBottom: '20px',
              fontSize: '20px',
              textAlign: 'center',
            }}>
              What tasks do you want to get done this week? How much time would you like to allocate per task? </Typography>
            <form>
              {taskFields.map((form, index) => {
                return (
                  <div key={index}>
                    <input
                      name='name'
                      placeholder='Name'
                      onChange={event => handleFormChange(event, index)}
                      value={form.name}
                    />
                    <input
                      name='duration'
                      placeholder='Duration (Hours)'
                      onChange={event => handleFormChange(event, index)}
                      value={form.duration}
                    />
                    <button onClick={() => removeFields(index)}>Remove</button>
                  </div>
                )
              })}
            </form>
            <button onClick={addFields}>Add More..</button>
            <Typography style={{
              color: '#41521F',
              fontFamily: 'Poppins',
              fontWeight: 'bold',
              marginTop: '20px',
              fontSize: '20px',
              textAlign: 'center',
            }}>
              What time would you like to start and and each day?
            </Typography>
            <Stack direction="row" spacing={2}
            style={{
              margin: 'auto',
              marginTop: '20px',
              paddingTop: '20px',
              paddingLeft: '35%'
            }}>
                <Typography style={{
                color: '#41521F',
                fontFamily: 'Poppins',
                fontWeight: 'bold',
                marginTop: '20px',
                paddingTop: '15px',
                fontSize: '20px',
                textAlign: 'center',
                }}>Start: </Typography>
                <Autocomplete
                  id="disabled-options-demo"
                  options={timeSlots}
                  sx={{ width: 300 }}
                  onChange = {
                    (event, newValue) => {
                      console.log(newValue);
                      setSleepTimeStart(newValue);
                    }}
                  renderInput={(params) => <TextField {...params} label="Choose a time..." 
                  />}
                />
            </Stack>
            <Stack direction="row" spacing={2} style={{
              margin: 'auto',
              marginBottom: '20px',
              paddingTop: '20px',
              paddingLeft: '36%'
            }}>
                <Typography style={{
                  color: '#41521F',
                  fontFamily: 'Poppins',
                  fontWeight: 'bold',
                  marginTop: '20px',
                  fontSize: '20px',
                  textAlign: 'center',
                }}>End: </Typography>
                <Autocomplete
                  id="disabled-options-demo"
                  options={timeSlots}
                  sx={{ width: 300 }}
                  onChange = {
                  (event, newValue) => {
                    console.log(newValue);
                    setSleepTimeEnd(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Choose a time..."/>}
                />
            </Stack>
            <Button variant="contained" onClick={uploadFile}>generate schedule</Button>
        </Container>
      }
      </div>
    </div>
  );
}

export default App;

//onChange: (e) => setFileToBeSent(e.target.files[0])

//<Button variant="contained" onClick={uploadFile}>generate schedule</Button>

/*formData.append("file", file);
    formData.append("exclude", JSON.stringify(
      {start: sleepTimeEnd, end: sleepTimeStart}
    ));
    formData.append("tasks", JSON.stringify(taskFields));
    formData.append("startDate", JSON.stringify({year: startDate.$y, month: startDate.$M +1, day: startDate.$D}));
    formData.append("endDate", JSON.stringify({year: endDate.$y, month: endDate.$M +1, day: endDate.$D}));
    

    <FilePond
                      files={fileToBeSent}
                      onupdatefiles={setFileToBeSent}
                      allowMultiple={false}
                      maxFiles={3}
                      name="calendar"
                      labelIdle='Drag & Drop your .ics file to use the Calendula schedule creator!'
                    />

formData.append("file", file);
    formData.append("exclude", JSON.stringify(
      {start: "23:00", end: "06:30"}
    ));
    formData.append("tasks", JSON.stringify([
      {name: "Task 1", duration: 5},
      {name: "Task 2", duration: 16},
      {name: "Task 3", duration: 5},
      {name: "Task 4", duration: 1},

    ]));
    formData.append("startDate", JSON.stringify({year: 2023, month: 9, day: 25}));
    formData.append("endDate", JSON.stringify({year: 2023, month: 9, day: 29}));
                    */