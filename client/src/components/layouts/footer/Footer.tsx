import React from 'react';
import './Footer.scss';
import { Box, Button, Typography } from '@mui/material';
import { GiCircle, GiCircleClaws, GiCircleSparks } from 'react-icons/gi';
import { logo } from 'src/utils';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';

const Footer = () => {
  return (
    <Box className="footer_container">
      <Box className="logo_footer">
        <GiCircleClaws />
        <img src={logo} alt="logo" />
      </Box>
      <Typography className="question_footer">What are you waiting for?</Typography>
      <Button>Discovery Now</Button>
      <Box className="text_footer">
        <Typography>
          <IoCheckmarkDoneCircleOutline />
          No monthly charge
        </Typography>
        <Typography>
          <IoCheckmarkDoneCircleOutline />
          No infringement of personal rights
        </Typography>
        <Typography>
          <IoCheckmarkDoneCircleOutline />
          Premium support
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
