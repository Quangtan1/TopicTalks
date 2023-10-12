import React from 'react';
import { Grid, Paper, Avatar, Typography, Button, IconButton, Tabs, Tab, Box, Divider } from '@mui/material';
import { Message } from '@mui/icons-material';
import { observer } from 'mobx-react';

import './Profile.scss';
import About from './about/About';
import uiStore from 'src/store/uiStore';
import accountStore from 'src/store/accountStore';
import NewPost from '../postManagement/newPost/NewPost';
import PostItem from '../postManagement/post/PostItem';
import { useNavigate } from 'react-router-dom';
import { useGetUserById } from 'src/queries';
import { createAxios } from 'src/utils';
import Loading from 'src/components/loading/Loading';
import EditProfileModal from './editProfileModal';

const Profile = observer(() => {
  // ==========================Config mobx==========================
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const axiosJWT = createAxios(account, setAccount);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isEditProfile, setIsEditProfile] = React.useState(false);
  const isResize = uiStore?.collapse;

  const {
    data: userDetailData,
    isLoading: isLoadingUserDetail,
    refetch: refetchUserById,
  } = useGetUserById(account?.id, axiosJWT, account);

  const handleGoToMessagePage = () => {
    navigate('/message');
  };

  const handleEditProfile = () => {
    setIsEditProfile(!isEditProfile);
  };

  return isLoadingUserDetail ? (
    <>
      <Loading />
    </>
  ) : (
    <Box className={`profile__container ${isResize ? 'expand_profile' : 'collapse_profile'}`}>
      <Paper elevation={3} className="profile__paper">
        <Grid container alignItems="center" className="profile__banner">
          <Grid item xs={8} className="title_container">
            <Box className="banner_avatar_wrap">
              {!userDetailData ? (
                <Avatar className="banner_avatar" />
              ) : (
                <img className="banner_avatar" src={account?.url_img || userDetailData?.imageUrl} alt="son" />
              )}
            </Box>
            <Box className="title_wrap">
              <Typography className="title" variant="h4">
                {account?.username?.slice(0, 11)}
              </Typography>
              <Typography className="subtitle" variant="subtitle1">
                This is the {account?.roles?.includes('ROLE_USER') ? 'user' : 'admin' || 'Front-end developer'} account
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4} justifyContent="flex-end" className="button_container">
            <IconButton
              color="primary"
              className="icon-message-wrap"
              aria-label="Nhắn tin"
              onClick={handleGoToMessagePage}
            >
              <Message className="icon-message" />
            </IconButton>
            <Button className="button__public" variant="contained" onClick={handleEditProfile}>
              Edit Profile
            </Button>
            <Button className="button__group" variant="contained" onClick={() => setIsEdit(true)}>
              Create Post
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 3-column layout */}
      <Grid container spacing={2} className="main__layout_container">
        <Grid item xs={3} className="column__1_container">
          <About data={userDetailData} />
          {/* <Paper className="column__1_paper" elevation={3}>
            <Typography variant="h6" className="title_paper_text">
              Interesting Topics
            </Typography>
          </Paper> */}
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
              <PostItem isProfile={true} />
            </Box>
          </Paper>
        </Grid>

        {/* Column 3 */}
        <Grid item xs={3} className="column__3_container">
          <Paper elevation={3} className="column__3_paper">
            <Typography className="title_paper_text" variant="h6">
              Bio
            </Typography>
            <Typography variant="body2" className="bio">
              {userDetailData?.bio || 'This is the bio'}
            </Typography>
            <Divider sx={{ margin: '20px 0' }} />
          </Paper>
          {/* <Paper elevation={3} className="column__3_paper">
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
            </List>
            <Divider sx={{ margin: '20px 0' }} />
          </Paper> */}
          {/* <Paper elevation={3} className="column__3_paper">
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
            </List>
          </Paper> */}
        </Grid>
      </Grid>
      <NewPost open={isEdit} closePostModal={() => setIsEdit(!isEdit)} />
      <EditProfileModal
        isOpen={isEditProfile}
        handleClose={() => setIsEditProfile(!isEditProfile)}
        onEditSuccess={refetchUserById}
      />
    </Box>
  );
});

export default Profile;
