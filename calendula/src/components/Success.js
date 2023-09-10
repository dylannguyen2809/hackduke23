import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Success() {
  return (
    <div style={{
      backgroundImage: `url("/background.jpeg")`,
      height: '500px',
      padding: '170px',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}>
      <Typography
        style={{
        textAlign: 'center', 
        color: '#FC9F55', 
        fontSize: 96, 
        fontFamily: 'Lobster', 
        fontWeight: '400', 
        wordWrap: 'break-word'}}
        variant='h1'
      >
        Calendula
      </Typography>

      <Typography
        style={{
          textAlign: 'center', 
          color: '#FD7E4B', 
          fontSize: 48, 
          fontFamily: 'Poppins', 
          fontWeight: '600', 
          wordWrap: 'break-word',
          marginTop: '77px'
          
        }}
        variant='h3'
      >
        Hooray! Your Schedule is now ready!
      </Typography>


      <Accordion style={{
        width: '600px',
        margin: 'auto',
        marginTop: '70px',
        backgroundColor: '#F7F7F7'
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            style={{
              textAlign: 'center',
              color: '#ACACAC', 
              fontSize: 20, 
              fontFamily: 'Poppins', 
              fontWeight: '200', 
              wordWrap: 'break-word',

            }}
            variant='h4'
          >
            How do I upload this to Google Calendar?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
          style={{
            textAlign: 'left',
            color: '#ACACAC',
          }}>
          1. Open Google Calendar.<br/>
          2. In the top right, click the gear icon and select Settings.<br/>
          3. In the menu on the left, click Import & Export.<br/>
          4. Click Select file from your computer and select the file you exported. The file should end in ".ics"<br/>
          5. Choose which calendar to add the imported events to. By default, events are imported into your primary calendar.<br/>
          6. Click Import.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>

  );
}

export default Success;