import { Box, Typography } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import memoizeOne from 'memoize-one';
import './LandingView.scss';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const LandingView = observer(() => {
  const [listTopic, setListTopicParent] = useState<ListTopic[]>([]);
  const [topicChildMap, setTopicChildMap] = useState<Map<number, TopicChild[]>>(new Map());
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
    getDataAPI(`/topic-parent/all`, accountToken, axiosJWT)
      .then((res) => {
        if (res.data.data !== 'Not exist any children topic.') {
          setListTopicParent(res.data.data);
          if (res.data.data.length > 0) {
            res.data.data.forEach((topicParent) => {
              const parentId = topicParent.id;
              getTopicChildByParentId(parentId);
            });
          }
        } else {
          uiStore?.setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getTopicChildByParentId = useMemo(
    () =>
      memoizeOne((parentId: number) => {
        if (topicChildMap.has(parentId)) {
          uiStore?.setLoading(false);
          return topicChildMap.get(parentId);
        }
        getDataAPI(`/topic-children/topic-parent=${parentId}`, accountToken, axiosJWT)
          .then((res) => {
            setTopicChildMap((prevMap) => new Map(prevMap).set(parentId, res.data.data));
            uiStore?.setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
        return null;
      }),
    [],
  );

  const navigateToDetailTopic = (id: number) => {
    navigate(`/topic-detail/${id}`);
  };

  return (
    <Box className="landing_container">
      {listTopic.length > 0 &&
        listTopic?.map((topicParent) => (
          <Box key={topicParent?.id} className="topic_box">
            <Typography className="title_parent_topic">
              <strong>Discovery</strong> {topicParent.topicParentName}
            </Typography>
            <Typography className="title_background">{topicParent.topicParentName}</Typography>
            <Carousel
              swipeable={false}
              draggable={false}
              showDots={false}
              responsive={responsive}
              ssr={true}
              infinite={true}
              partialVisible={true}
            >
              {topicChildMap?.size > 0 &&
                topicChildMap?.get(topicParent?.id)?.map((topicChild) => (
                  <Box
                    key={topicChild.id}
                    className="card_topic_child"
                    onClick={() => navigateToDetailTopic(topicChild.id)}
                  >
                    <Typography className="topic_child_title">{topicChild.topicChildrenName}</Typography>
                    <img src={topicChild?.image} alt="topic" className="image_topic" />
                    <div className="overlay"></div>
                  </Box>
                ))}
              <></>
            </Carousel>
          </Box>
        ))}
    </Box>
  );
});

export default LandingView;
