import React from 'react';
import { Box, Typography } from '@mui/material';
import './SuggestBox.scss';
import TopicBox from './TopicBox';

const SuggestBox = () => {
  return (
    <Box className="suggest-container">
      <Box className="active-user-box">
        <Typography>Active User</Typography>
        <Typography>There are no recently active members</Typography>
      </Box>
      <TopicBox />
    </Box>
  );
};

export default SuggestBox;
