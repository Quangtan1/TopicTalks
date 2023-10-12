import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PartnerProfile.scss';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { createAxios, getDataAPI, logo, postDataAPI } from 'src/utils';
import { IUserProfile } from 'src/types/account.types';
import { IPost } from 'src/queries';

const PartnerProfile = observer(() => {
  const { id } = useParams();
  const [user, setUser] = useState<IUserProfile>(null);
  const [posts, setPosts] = useState<IPost[]>([]);

  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    getDataAPI(`/user/${id}`, account.access_token, axiosJWT)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getDataAPI(`/post/${id}/all-posts`, account.access_token, axiosJWT)
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const postApproves = posts?.filter((item) => item.approved);

  const addFriend = () => {
    const friendData = {
      userId: account.id,
      friendId: id,
    };
    postDataAPI(`/friends/applyAddFriends`, friendData, account.access_token, axiosJWT)
      .then((res) => {
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box className="partner-profile-container">
      <Box className="title_box">
        <Typography className="title_backgroud">Profile</Typography>
        <Typography className="title_group">
          <strong>Personal</strong> Profile
        </Typography>
      </Box>
      <Box className="partner_profile">
        <Box className="avt_image">
          <div className="backgroud_image" />
          <img src={user?.imageUrl || logo} alt="avt" />
        </Box>
        <Box className="info_user">
          <Box className="bio_box">
            <Typography className="title">Bio</Typography>
            <Typography>
              I am a highly skilled and passionate software engineer with over 10 years of experience in the field. He
              specializes in developing robust web applications and has a strong proficiency in multiple programming
              languages, including Java, Python, and JavaScript.
            </Typography>
          </Box>
          <Grid container spacing={4} className="grid_container">
            <Grid item md={6}>
              <Typography className="title">Age :...</Typography>
              <Typography>ZX</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Dob :...</Typography>
              <Typography>{user?.dob || 'XX YY ZZZZ'}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Phone :...</Typography>
              <Typography>XXX XXXX XXXX</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Nationality :...</Typography>
              <Typography>{user?.country || 'ZXZXX'}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Email :...</Typography>
              <Typography>{user?.email || 'ZXZXX'}</Typography>
            </Grid>
          </Grid>
          <Box className="action_box">
            <Button>Message</Button>
            <Button onClick={addFriend}>Add Friend</Button>
          </Box>
        </Box>
      </Box>
      <Box className="title_box">
        <Typography className="title_backgroud">Post</Typography>
        <Typography className="title_group">
          <strong>All</strong> Posts
        </Typography>
      </Box>
      <Grid className="post_container" container spacing={4}>
        {postApproves?.map((item) => (
          <Grid md={4} item key={item.id}>
            <Card className="card_post">
              <CardMedia image={item.img_url} className="image" />
              <CardContent className="card_content">
                <Typography>{item.title}</Typography>
                <Typography>{item.content}</Typography>
              </CardContent>
              <CardActions className="card_action">
                <Button>More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default PartnerProfile;
