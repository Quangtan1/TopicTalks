import { Box, Typography } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import memoizeOne from 'memoize-one';
import './HomePage.scss';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import { beginChat, createAxios, getDataAPI, lettermessage, typing } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, ListTopicHot, TopicChild } from 'src/types/topic.type';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';
import TopicParent from './topicparent/TopicParent';
import { IPost } from 'src/queries';
import PostPopular from './postpopular/PostPopular';
import TopicPopular from './topicpopular/TopicPopular';

const HomePage = observer(() => {
  const [listTopic, setListTopicParent] = useState<ListTopic[]>([]);
  const [listTopicHot, setListTopicParentHot] = useState<ListTopicHot[]>([]);
  const [listPost, setListPost] = useState<IPost[]>([]);
  const [listPostHot, setListPostHot] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountToken = account?.access_token;

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`/topic-parent/all-tparent?isDisable=false`, accountToken, axiosJWT)
      .then((res) => {
        if (res?.data?.data !== 'Not exist any children topic.') {
          setListTopicParent(res?.data?.data);
        } else {
          uiStore?.setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    getDataAPI(`/post/popular-posts?isApproved=true`, accountToken, axiosJWT)
      .then((res) => {
        setListPost(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`ratings/all/topics/hot`, accountToken, axiosJWT)
      .then((res) => {
        setListTopicParentHot(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <Box className="home_container">
      <TopicPopular listTopic={listTopicHot} />
      <TopicParent listTopic={listTopic} />
      <PostPopular posts={listPost} />
    </Box>
  );
});

export default HomePage;
