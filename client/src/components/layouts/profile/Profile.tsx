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
} from '@mui/material';
import { Message } from '@mui/icons-material';
import { observer } from 'mobx-react';

import './Profile.scss';
import About from './about/About';
import uiStore from 'src/store/uiStore';
import accountStore from 'src/store/accountStore';
import NewPost from '../postManagement/newPost/NewPost';
import PostItem from '../postManagement/post/PostItem';
// import { useGetAllPosts } from 'src/queries';

const Profile = observer(() => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [isEdit, setIsEdit] = React.useState(false);
  const isResize = uiStore?.collapse;
  const { roles, username, url_img } = accountStore.account;

  return (
    <Box className={`profile__container ${isResize ? 'expand_profile' : 'collapse_profile'}`}>
      <Paper elevation={3} className="profile__paper">
        {/* Banner */}
        <Grid container alignItems="center" className="profile__banner">
          <Grid item xs={8} className="title_container">
            <Box className="banner_avatar_wrap">
              <img
                className="banner_avatar"
                src={
                  url_img ||
                  'https://media.licdn.com/dms/image/D5603AQEXwrJ2rM5eyg/profile-displayphoto-shrink_800_800/0/1670055489653?e=1700092800&v=beta&t=tRcVVR9okYVAQMhy5pbjU50MLVIS3wua04jaAOXLZX8'
                }
                alt="son"
              />
            </Box>
            <Box className="title_wrap">
              <Typography className="title" variant="h4">
                {username || 'Le V Son'}
              </Typography>
              <Typography className="subtitle" variant="subtitle1">
                This is the {roles?.includes('ROLE_USER') ? 'user' : 'admin' || 'Front-end developer'} account
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
            <Button className="button__group" variant="contained" onClick={() => setIsEdit(true)}>
              Create Post
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 3-column layout */}
      <Grid container spacing={2} className="main__layout_container">
        {/* Column 1 */}
        <Grid item xs={3} className="column__1_container">
          <About
            gender="Male"
            birthDate="Born July 15th, 2001"
            address="01 Nguyen Van Linh - Da Nang"
            email="Levson@gmail.com"
            phone="0123456789"
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
      <NewPost open={isEdit} closePostModal={() => setIsEdit(!isEdit)} />
    </Box>
  );
});

export default Profile;
