import React from 'react';
import { Box } from '@mui/material';
import { loading } from 'src/utils';
import './Loading.scss';

const Loading = () => {
  return (
    <Box className="loading-container">
      <img src={loading} alt="loading" />
      <div className="overlay"></div>
    </Box>
  );
};

export default Loading;
