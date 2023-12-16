import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import { IRecommendTopic, ListTopicHot } from 'src/types/topic.type';
import './RecommendTopic.scss';
import { responsive } from 'src/utils/helper';
import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import { useNavigate } from 'react-router-dom';

interface IRecommendProps {
  recommendTopic: IRecommendTopic[];
}

const RecommendTopic = (props: IRecommendProps) => {
  const { recommendTopic } = props;
  const navigate = useNavigate();

  const navigateTopic = (id: number) => {
    navigate(`/topic-detail/${id}`);
  };
  return (
    <Box className="recommend_topic_container">
      <Box className="recommend_topic">
        <Typography className="title">RECOMMEND FOR YOU</Typography>
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
            {recommendTopic?.map((item) => (
              <Box
                className="topic_parent_box"
                key={item.topicChildrenId}
                onClick={() => navigateTopic(item.topicChildrenId)}
              >
                <Avatar src={item.image} alt="img" className="avatar" />
                <Box className="topic_parent_title">
                  <Typography>{item.topicChildrenName}</Typography>
                  <Typography>{item.shortDescription}</Typography>
                </Box>
              </Box>
            ))}
            <></>
          </Carousel>
        </Box>
      </Box>
    </Box>
  );
};

export default RecommendTopic;
