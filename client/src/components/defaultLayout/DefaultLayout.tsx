import React from 'react';
import { Box, Grid } from '@mui/material';
import './DefaultLayout.scss';
import Header from '../layouts/header/Header';
import SideBar from '../layouts/sidebar/SideBar';

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
