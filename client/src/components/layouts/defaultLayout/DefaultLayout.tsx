import React from 'react';
import { Box, Grid } from '@mui/material';
import Header from '../header/Header';
import SideBar from '../sidebar/SideBar';
import './DefaultLayout.scss';

const DefaultLayout = ({ children }) => {
  return (
    <Box className="common-page-container">
      <Header />
      <Box className="route-container">
        <SideBar />
        {children}
      </Box>
    </Box>
  );
};

export default DefaultLayout;
