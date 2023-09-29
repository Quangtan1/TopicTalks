import { Box, Button, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';
import { TopicChild } from 'src/types/topic.type';
import { createAxios, getDataAPI, headerRoute, logo } from 'src/utils';
import './TopicChildDetail.scss';

const fakeGroupChat = [
  {
    id: 1,
    groupName: 'Healthy Eaters Club',
  },
  {
    id: 2,
    groupName: 'Nutrition Enthusiasts',
  },
  {
    id: 3,
    groupName: 'Clean Eating Community',
  },
];

const TopicChildDetail = observer(() => {
  const { id } = useParams();
  const [topicChild, setTopicChild] = useState<TopicChild>(null);
  const account = accountStore?.account;
  const navigate = useNavigate();

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);
  useEffect(() => {
    getDataAPI(`/topic-children/${id}`, account.access_token, axiosJWT).then((res) => {
      setTopicChild(res.data.data);
      console.log('res', res.data.data);
    });
  }, [id]);

  return (
    <Box className="topic_child_container">
      <Box className="header_child">
        <Box className="logo_sidebar">
          <img src={logo} alt="logo" />
          <Box className="title_logo">
            <Typography>TopicTalks</Typography>
            <Typography>Anonymously</Typography>
          </Box>
        </Box>
        <Box className="header_option">
          {headerRoute.map((item, index) => (
            <Typography key={index} onClick={() => navigate(`${item.path}`)}>
              {item.title}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box className="box_topic_child">
        <Typography className="title_topic">{topicChild?.topicChildrenName}</Typography>
        <Typography className="sologan_topic">
          Engage in <strong className="highlight_text">Unrestricted conversations</strong>, exploring the world through
          <strong className="highlight_text"> various preferred topics </strong> while maintaining anonymous
          connections."
        </Typography>
        <img src={topicChild?.image} alt="img" className="image_topic" />
      </Box>
      <Box className="box_group_chat">
        <Typography>"Topic-based conversations without revealing your identity."</Typography>
        <Grid container className="group_container">
          {fakeGroupChat.map((item) => (
            <Grid item md={4} key={item.id} className="group_box">
              <Typography>{item.groupName}</Typography>
              <Button>Join Group</Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
});

export default TopicChildDetail;
