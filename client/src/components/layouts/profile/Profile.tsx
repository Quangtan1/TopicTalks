import React from 'react';
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  capitalize,
} from '@mui/material';
import { Message } from '@mui/icons-material';
import { observer } from 'mobx-react';

import './Profile.scss';
import PostItem from '../home/post/PostItem';
import About from './about/About';
import uiStore from 'src/store/uiStore';
import accountStore from 'src/store/accountStore';
import { formatDate } from 'src/utils/helper';

const Profile = observer(() => {
  const [activeTab, setActiveTab] = React.useState(0);
  const isResize = uiStore?.collapse;
  const { email, country, gender, dob, first_name, last_name, phone_number, username, roles, url_img } =
    accountStore?.account || {};

  return (
    <Box className={`profile__container ${isResize ? 'expand_profile' : 'collapse_profile'}`}>
      <Paper elevation={3} className="profile__paper">
        {/* Banner */}
        <Grid container alignItems="center" className="profile__banner">
          <Grid item xs={8} className="title_container">
            <Box className="banner_avatar_wrap">
              <img className="banner_avatar" src={url_img} alt="son" />
            </Box>
            <Box className="title_wrap">
              <Typography className="title" variant="h4">
                {username}
              </Typography>
              <Typography className="subtitle" variant="subtitle1">
                {capitalize(`${roles?.join('/')} ${first_name} ${last_name}`)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4} justifyContent="flex-end" className="button_container">
            <IconButton color="primary" className="icon-message-wrap" aria-label="Nhắn tin">
              <Message className="icon-message" />
            </IconButton>
            <Button className="button__public" variant="contained">
              Public
            </Button>
            <Button className="button__group" variant="contained">
              Create Group
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 3-column layout */}
      <Grid container spacing={2} className="main__layout_container">
        {/* Column 1 */}
        <Grid item xs={3} className="column__1_container">
          <About
            gender={gender}
            birthDate={`Born ${formatDate(dob)}`}
            address={country}
            email={email}
            phone={phone_number}
          />
          <Paper className="column__1_paper" elevation={3}>
            <Typography variant="h6" className="title_paper_text">
              Interesting Topics
            </Typography>
            {/* Icons for interesting topics */}
          </Paper>
        </Grid>

        {/* Column 2 */}
        <Grid item xs={6} className="column__2_container">
          <Paper elevation={3} sx={{ height: '100%' }} className="column__2_paper">
            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
              sx={{ padding: '20px' }}
              indicatorColor="secondary"
              textColor="secondary"
            >
              <Tab label="Post" />
              <Tab label="Publicity" />
              <Tab label="Following Posts" />
            </Tabs>
            <Box>
              <PostItem />
            </Box>
          </Paper>
        </Grid>

        {/* Column 3 */}
        <Grid item xs={3} className="column__3_container">
          <Paper elevation={3} className="column__3_paper">
            <Typography className="title_paper_text" variant="h6">
              You Might Know
            </Typography>
            <List>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary="User Code" secondary="Subtitle" />
              </ListItem>
              {/* More suggestions */}
            </List>
            <Divider sx={{ margin: '20px 0' }} />
          </Paper>
          <Paper elevation={3} className="column__3_paper">
            <Typography className="title_paper_text" variant="h6">
              Active
            </Typography>
            <List>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary="User Code"
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2">Online</Typography>
                      <Typography variant="subtitle2">9 hours ago</Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {/* More active users */}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default Profile;
