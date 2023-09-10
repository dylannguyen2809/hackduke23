import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider, Typography } from '@mui/material';

function Success() {
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Lobster',
        'cursive', 
        'Poppins', 
        'sans-serif',
      ].join(','),
  
  },});


  return (
    <div>
      <Typography
        style={{
        marginTop: '174px',
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
        Hooray! Your Schedule is now ready
      </Typography>

      <div style={{width: '100%', height: '100%', background: '#FAC05E', borderRadius: 10}} />

      <Typography
        style={{
          textAlign: 'center',
          color: '#ACACAC', 
          fontSize: 22, 
          fontFamily: 'Poppins', 
          fontWeight: '200', 
          wordWrap: 'break-word',
          marginTop: '177px'
        }}
        variant='h4'
      >
        How do i upload this to GCal?
      </Typography>

    </div>

  );
}

export default Success;