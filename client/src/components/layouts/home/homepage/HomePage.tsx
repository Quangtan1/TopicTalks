import { Box, Typography } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import memoizeOne from 'memoize-one';
import './HomePage.scss';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import { aboutme, beginChat, createAxios, getDataAPI, lettermessage, typing } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';
import { GiPlainSquare } from 'react-icons/gi';

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
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

const HomePage = observer(() => {
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
    getDataAPI(`/topic-parent/all-tparent?isDisable=false`, accountToken, axiosJWT)
      .then((res) => {
        if (res?.data?.data !== 'Not exist any children topic.') {
          setListTopicParent(res?.data?.data);
          if (res?.data?.data?.length > 0) {
            res?.data?.data.forEach((topicParent) => {
              const parentId = topicParent?.id;
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
        getDataAPI(`/topic-children?tpid=${parentId}&&is_expired=false`, accountToken, axiosJWT)
          .then((res) => {
            setTopicChildMap((prevMap) => new Map(prevMap).set(parentId, res.data.data));
            uiStore?.setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
        return null;
      }),
    [listTopic],
  );

  const searchToopicParent = () => {};

  const navigateToDetailTopic = (id: number) => {
    navigate(`/topic-detail/${id}`);
  };

  return (
    <Box className="landing_container">
      <Box className="intro_view">
        <Box className="background_view">
          <Box className="box_image">
            <img src={beginChat} alt="support" className="support" />
            <img src={lettermessage} alt="overthink" className="overthink" />
          </Box>
          <img src={typing} alt="about me" className="about_me" />
        </Box>
        <Box className="title_lead">
          <Typography>MAKE COMMUNICATION FUN</Typography>
          <Typography>
            TopicTalks fosters an enjoyable and supportive chat environment to enhance your interaction.
          </Typography>
          <Typography>
            The current website aims to improve users' lives by promoting open-mindedness and better communication. By
            providing a welcoming and secure space for exchanges.
          </Typography>
        </Box>
      </Box>
      {listTopic?.length > 0 &&
        listTopic?.map((topicParent, index) => (
          <Box key={topicParent?.id} className="topic_box">
            {index % 2 ? (
              <Box className="box_title_parent">
                <div className="divider_right">
                  <GiPlainSquare />
                </div>
                <Typography className="title_parent_topic_right"> {topicParent.topicParentName}</Typography>
              </Box>
            ) : (
              <Box className="box_title_parent">
                <Typography className="title_parent_topic"> {topicParent.topicParentName}</Typography>
                <div className="divider">
                  <GiPlainSquare />
                </div>
              </Box>
            )}

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
                    <Typography className="description">
                      Lorem ipsum dolor sit amet, con sectetuer adipiscing elit. Donec odio. Quisque volutpat mattis
                      eros.
                    </Typography>
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

export default HomePage;
