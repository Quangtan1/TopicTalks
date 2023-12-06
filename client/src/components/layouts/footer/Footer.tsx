import React, { useState } from 'react';
import './Footer.scss';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { headerRoute } from 'src/utils';
import { useNavigate } from 'react-router-dom';
import { ToastError } from 'src/utils/toastOptions';

interface IProps {
  scrollToTop: () => void;
}

const Footer = (props: IProps) => {
  const { scrollToTop } = props;
  const [inputSearch, setInputSearch] = useState<string>('');
  const navigate = useNavigate();

  const disableSearch = inputSearch === '';

  const navigateTopic = () => {
    scrollToTop();
    if (!disableSearch) {
      navigate(`/list-topic/search/${inputSearch}`);
      setInputSearch('');
    } else {
      ToastError('Please input data...');
    }
  };
  return (
    <Box className="footer_container">
      <Box className="footer_first">
        <Grid container>
          <Grid item md={3} className="footer_grid">
            <Typography className="title">ABOUT ME</Typography>
            <Box className="content">
              <Typography>Anonyminity Team</Typography>
              <Typography>FPT University</Typography>
              <Typography>System developer and operator</Typography>
            </Box>
          </Grid>
          <Grid item md={3} className="footer_grid">
            <Typography className="title">Encouragement</Typography>
            <Box className="content">
              <Typography>Share, inspire, and uplift.</Typography>
              <Typography>Networking chats</Typography>
              <Typography>Specific interest</Typography>
              <Typography>Social life</Typography>
            </Box>
          </Grid>
          <Grid item md={3} className="footer_grid">
            <Typography className="title">TAGCLOUD</Typography>
            <Box className="content">
              <Typography>
                Start writing, no matter what. The water does not flow until the faucet is turned on.
              </Typography>
              <Typography>No infrigement of personal rights</Typography>
              <Typography>Premium support</Typography>
            </Box>
          </Grid>
          <Grid item md={3} className="footer_grid">
            <Typography className="title">TOPICTALKS</Typography>
            <Box className="content">
              <Typography>Join our online community to improve for yourself</Typography>
              <Typography>No infrigement of personal rights</Typography>
              <Box className="search_box">
                <TextField
                  placeholder="Search topic..."
                  value={inputSearch}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13 && !e.shiftKey) {
                      navigateTopic();
                    }
                  }}
                  onChange={(e) => setInputSearch(e.target.value)}
                />
                <Button onClick={navigateTopic}>Search</Button>
              </Box>
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
