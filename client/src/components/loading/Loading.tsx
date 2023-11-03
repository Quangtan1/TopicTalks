import React from 'react';
import { Box } from '@mui/material';
import { loading } from 'src/utils';
import './Loading.scss';
import { BiLoaderCircle } from 'react-icons/bi';

const Loading = () => {
  return (
    <Box className="loading-container">
      <BiLoaderCircle className="icon" />
      <div className="overlay"></div>
    </Box>
  );
};

export default Loading;
