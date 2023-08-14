import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Box, Typography } from '@mui/material';
import { carousel1, carousel2 } from '../../../utils/consts';

const Carousels = () => {
  return (
    <Carousel
      autoPlay={true}
      axis="horizontal"
      infiniteLoop={true}
      showStatus={false}
      showThumbs={false}
      showArrows={false}
      className="carousels"
    >
      <Box>
        <img src={carousel1} alt="carousel1" />
        <Box className="legend">
          <Typography> ____ Join the Club</Typography>
          <Typography> Talk and share confidently</Typography>
          <Typography>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.
          </Typography>
        </Box>
        <div className="overlay"></div>
      </Box>
      <Box>
        <img src={carousel2} alt="carousel2" />
        <Box className="legend">
          <Typography> ____ Join the Club</Typography>
          <Typography> Talk and share confidently</Typography>
          <Typography>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.
          </Typography>
        </Box>
        <div className="overlay"></div>
      </Box>
    </Carousel>
  );
};

export default Carousels;
