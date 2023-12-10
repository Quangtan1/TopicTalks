import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { notresponve } from 'src/utils';
import './PageNotResponsive.scss';

const PageNotResponsive = () => {
  return (
    <Box className="page_not_respon_container">
      <img src={notresponve} alt="img" />
      <Typography>Oops! It seems like this page isn't responsive on tablets and mobile devices.</Typography>
      <Typography>We apologize for any inconvenience.</Typography>
      <Typography>
        The page you are trying to access may not display properly on tablets and mobile devices. Our team is working
        hard to make it compatible across all devices.
      </Typography>
      <Typography>
        If you are on a laptop or larger screen, you can continue browsing. Alternatively, you may visit our homepage or
        contact us via email:
      </Typography>
      <Typography>topictalks@gmail.com</Typography>
      <Typography>Thank you for your understanding.</Typography>
    </Box>
  );
};

export default PageNotResponsive;
