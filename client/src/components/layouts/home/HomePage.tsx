import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import './HomePage.scss';
import Header from '../header/Header';
import SideBar from '../sidebar/SideBar';
import PostItem from './post/PostItem';
import SuggestBox from './suggestbox/SuggestBox';

const HomePage = () => {
  return (
    <Box className="home-page-container">
      <Header />
      <Box className="new-feed-container">
        <SideBar />
        <Grid container className="new-feed">
          <Grid item md={7.5}>
            <PostItem />
          </Grid>
          <Grid item md={4.5}>
            <SuggestBox />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
