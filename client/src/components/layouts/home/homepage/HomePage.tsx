import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import './HomePage.scss';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, ListTopicHot, IRecommendTopic } from 'src/types/topic.type';
import 'react-multi-carousel/lib/styles.css';
import TopicParent from './topicparent/TopicParent';
import { IPost } from 'src/queries';
import PostPopular from './postpopular/PostPopular';
import TopicPopular from './topicpopular/TopicPopular';
import RecommendTopic from './recommend/RecommendTopic';
import SuggestDialog from '../suggestbox/SuggestDialog';

const HomePage = observer(() => {
  const [listTopic, setListTopicParent] = useState<ListTopic[]>([]);
  const [listTopicHot, setListTopicParentHot] = useState<ListTopicHot[]>([]);
  const [listPost, setListPost] = useState<IPost[]>([]);
  const [recommendTopic, setRecommendTopic] = useState<IRecommendTopic[]>(null);
  const account = accountStore?.account;

  const isSuggest = uiStore?.isSuggest;

  const setAccount = (value) => {
    accountStore?.setAccount(value);
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
    getDataAPI(`ratings/all/topics/hot`, accountToken, axiosJWT)
      .then((res) => {
        setListTopicParentHot(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
    getDataAPI(`/recommends/user/${account?.id}`, accountToken, axiosJWT)
      .then((res) => {
        setRecommendTopic(res.data.data);
        res.data.data.length > 0 && uiStore?.setIsSuggest(false);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
  }, []);

  const isOpen = isSuggest && recommendTopic?.length === 0;

  return (
    <Box className="home_container">
      <TopicPopular listTopic={listTopicHot} />
      {recommendTopic?.length > 0 && <RecommendTopic recommendTopic={recommendTopic} />}
      <TopicParent listTopic={listTopic} />
      <PostPopular posts={listPost} />
      {isOpen && <SuggestDialog open={isOpen} onClose={() => uiStore?.setIsSuggest(false)} listTopic={listTopic} />}
    </Box>
  );
});

export default HomePage;
