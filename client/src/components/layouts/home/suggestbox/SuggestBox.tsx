import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import './SuggestBox.scss';
import TopicBox from './TopicBox';
import FriendBox from './FriendBox';
import { preminnum } from 'src/utils';

const SuggestBox = () => {
  return (
    <Box className="suggest-container">
      <Box className="active-user-box">
        <Typography>Active User</Typography>
        <Typography>There are no recently active members</Typography>
      </Box>
      <TopicBox />
      <FriendBox />
      <Box className="try-prenium">
        <Button>Try Premium</Button>
        <img src={preminnum} alt="preminnum" />
      </Box>
    </Box>
  );
};

export default SuggestBox;
