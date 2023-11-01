import React from 'react';
import './Footer.scss';
import { Box, Button, Grid, Typography } from '@mui/material';
import { GiCircle, GiCircleClaws, GiCircleSparks } from 'react-icons/gi';
import { logo } from 'src/utils';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';

const Footer = () => {
  return (
    <Box className="footer_container">
      <Box className="footer_first">
        <img src={logo} alt="logo" />
        <Grid container>
          <Grid item md={4} className="footer_grid">
            <Typography className="title">ABOUT TOPICTALKS</Typography>
            <Box className="content">
              <Typography>No monthly charge</Typography>
              <Typography>No infrigement of personal rights</Typography>
              <Typography>Premium support</Typography>
            </Box>
          </Grid>
          <Grid item md={4} className="footer_grid">
            <Typography className="title">PRODUCT</Typography>
            <Box className="content">
              <Typography>Testinomials</Typography>
              <Typography>How it works</Typography>
              <Typography>Member Discounts</Typography>
            </Box>
          </Grid>
          <Grid item md={4} className="footer_grid">
            <Typography className="title">NOT QUITE READY FOR TOPICTALKS</Typography>
            <Box className="content">
              <Typography>Join our online community to improve for yourself</Typography>
              <Typography>No infrigement of personal rights</Typography>
              <Button>Contact Now</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className="footer_second">
        <Typography>
          IMPLEMENT © 2023. ANONYMINITY TEAM | PRIVACY POLICY | TERMS OF USE | THEME BY <strong>TOPICTALKS</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
