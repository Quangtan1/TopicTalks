import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import './PageNotFound.scss';
import { notfound } from 'src/utils';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <Box className="page_not_found_container">
      <img src={notfound} alt="img" />
      <Typography>Woops! Looks like this page doesn’t exist</Typography>
      <Typography>Sorry! The page you were looking for has been moved or doesn’t exist. If</Typography>
      <Typography>you like, you can return to our homepage, or send us an email to:</Typography>
      <Typography>topictalks@gmail.com</Typography>
      <Button onClick={() => navigate('/home')}>Go To Homepage</Button>
    </Box>
  );
};

export default PageNotFound;
