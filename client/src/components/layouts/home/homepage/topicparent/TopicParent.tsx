import { Box, Typography } from '@mui/material';
import React from 'react';
import './TopicParent.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel as SingleCarousel } from 'react-responsive-carousel';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';
import { GiPlainSquare } from 'react-icons/gi';
import { ListTopic } from 'src/types/topic.type';
import { CiCamera } from 'react-icons/ci';
import { responsive } from 'src/utils/helper';

interface TopicParentProps {
  listTopic: ListTopic[];
}
const TopicParent = (props: TopicParentProps) => {
  const { listTopic } = props;
  const navigate = useNavigate();
  const navigateListTopic = (id: number, name: string) => {
    navigate(`/list-topic/${id}/${name}`);
  };
  return (
    <Box className="topic_parent_container">
      <Box className="box_title_parent">
        <Typography className="title_parent_topic">FEATURED TOPICS</Typography>
      </Box>
      <Box className="first_box">
        <SingleCarousel
          autoPlay={true}
          axis="horizontal"
          infiniteLoop={true}
          showStatus={false}
          showThumbs={false}
          showArrows={true}
          showIndicators={false}
          className="carousels"
        >
          {listTopic?.map((item) => (
            <Box key={item.id}>
              <img loading="lazy" src={item.image} alt="carousel1" />
              <Box className="legend" onClick={() => navigateListTopic(item.id, item.topicParentName)}>
                <Typography>{}</Typography>
                <Typography>{item.topicParentName}</Typography>
                <Typography>{item.shortDescript}</Typography>
              </Box>
              <div className="overlay"></div>
            </Box>
          ))}
        </SingleCarousel>

        {listTopic?.slice(0, 1).map((item) => (
          <Box
            className="topic_parent_box"
            key={item.id}
            onClick={() => navigateListTopic(item.id, item.topicParentName)}
          >
            <CiCamera />
            <img src={item.image} alt="img" />
            <Box className="topic_parent_title">
              <Typography>topic.</Typography>
              <Typography>{item.topicParentName}</Typography>
              <Typography>{item.shortDescript}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box className="second_box">
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={true}
          infinite={true}
          partialVisible={true}
        >
          {listTopic?.map((item) => (
            <Box
              className="topic_parent_box"
              key={item.id}
              onClick={() => navigateListTopic(item.id, item.topicParentName)}
            >
              <CiCamera />
              <img src={item.image} alt="img" />
              <Box className="topic_parent_title">
                <Typography>topic.</Typography>
                <Typography>{item.topicParentName}</Typography>
                <Typography>{item.shortDescript}</Typography>
              </Box>
            </Box>
          ))}
          <></>
        </Carousel>
      </Box>
    </Box>
  );
};

export default TopicParent;
