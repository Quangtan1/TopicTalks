import React from 'react';
import { Box, Button } from '@mui/material';
import './SuggestBox.scss';
import TopicBox from './TopicBox';
import FriendBox from './FriendBox';
import { preminnum } from 'src/utils';
import NewPost from '../../postManagement/newPost/NewPost';

const SuggestBox = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box className="suggest-container">
      <Box className="active-user-box">
        <Button variant="outlined" onClick={() => setIsOpen(true)}>
          Create a post
        </Button>
      </Box>
      <TopicBox />
      <FriendBox />
      <Box className="try-prenium">
        <Button>Try Premium</Button>
        <img src={preminnum} alt="preminnum" />
      </Box>
      <NewPost open={isOpen} closePostModal={() => setIsOpen(!isOpen)} />
    </Box>
  );
};

export default SuggestBox;
