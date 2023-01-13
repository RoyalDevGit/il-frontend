import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function Button({ children, onClick, isLoading, isDisabled, type }) {
  let backgroundColor = 'blue';
  if (type === 'submit') {
    backgroundColor = 'blue';
  } else if (type === 'cancel') {
    backgroundColor = 'red';
  } else if (type === 'link') {
    backgroundColor = 'green';
  }

  return (
    <button style={{ backgroundColor: isDisabled ? 'lightblue' : backgroundColor, color: 'white', borderRadius: '5px', cursor: 'pointer' }} disabled={isDisabled} onClick={onClick}>
      {isLoading ? <CircularProgress /> : children}
    </button>
  )
} 