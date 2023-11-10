import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Box, Typography } from '@mui/material';
import { aboutme, carousel1, carousel2, image_login } from 'src/utils/consts';
import { useNavigate } from 'react-router-dom';

const Carousels = () => {
  const navigate = useNavigate();
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
        <img src={aboutme} alt="carousel1" />
        <Box className="legend" onClick={() => navigate('/landing-view')} sx={{ cursor: 'pointer' }}>
          <Typography>Join the Community</Typography>
          <Typography>Chat Anonymously and Confidently</Typography>
          <Typography>
            Join our platform to engage in discussions and share your thoughts freely, knowing that your privacy is our
            priority.
          </Typography>
        </Box>
        <div className="overlay"></div>
      </Box>
      <Box>
        <img src={image_login} alt="carousel2" />
        <Box className="legend" onClick={() => navigate('/landing-view')} sx={{ cursor: 'pointer' }}>
          <Typography> ____ Join the Conversation</Typography>
          <Typography> Connect and Share with Confidence</Typography>
          <Typography>
            Join our platform to engage in meaningful conversations and share your ideas freely, knowing that your
            identity is protected.
          </Typography>
        </Box>
        <div className="overlay"></div>
      </Box>
    </Carousel>
  );
};

export default Carousels;
