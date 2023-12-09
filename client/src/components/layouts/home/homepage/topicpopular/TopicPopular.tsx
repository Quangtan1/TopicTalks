import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Carousel as SingleCarousel } from 'react-responsive-carousel';
import { ListTopic, ListTopicHot } from 'src/types/topic.type';
import './TopicPopular.scss';
import { FiberManualRecord } from '@mui/icons-material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { formatDatePost } from 'src/utils/helper';
import { GiRoundStar } from 'react-icons/gi';

interface TopicParentProps {
  listTopic: ListTopicHot[];
}
const TopicPopular = (props: TopicParentProps) => {
  const { listTopic } = props;

  const handleClickPrev = () => {
    const buttonPrev = document.querySelector('.carousel_large .control-prev') as HTMLElement;
    buttonPrev.click();
  };
  const handleClickNext = () => {
    const buttonNext = document.querySelector('.carousel_large .control-next') as HTMLElement;
    buttonNext.click();
  };
  useEffect(() => {
    const buttonPrev = document.querySelector('.carousel_small .control-prev');
    const buttonNext = document.querySelector('.carousel_small .control-next');
    buttonPrev && buttonPrev.addEventListener('click', handleClickPrev);
    buttonNext && buttonNext.addEventListener('click', handleClickNext);
    return () => {
      buttonPrev && buttonPrev.removeEventListener('click', handleClickPrev);
      buttonNext && buttonNext.removeEventListener('click', handleClickNext);
    };
  });
  return (
    <Box className="topic_popular">
      <SingleCarousel
        autoPlay={false}
        axis="horizontal"
        infiniteLoop={true}
        showStatus={false}
        showThumbs={false}
        showArrows={true}
        showIndicators={false}
        className="carousel_large"
      >
        {listTopic?.map((item) => (
          <Box className="box_topic_large" key={item.id}>
            <img src={item.image} alt="topic" />
            <Box className="box_topic_content">
              <Typography className="hot">Hot Topic</Typography>
              <Typography>{item.topicChildrenName}</Typography>
              <Typography>
                {formatDatePost(item.createdAt)} <FiberManualRecord /> 3K Views
              </Typography>
              <Typography className="max_rating">
                Max Rating:
                <Box sx={{ display: 'flex', pb: 1 }}>
                  {item?.maxRating &&
                    Array.from({ length: item?.maxRating }, (_, index) => (
                      <Box key={index}>
                        <GiRoundStar className="star-active" />
                      </Box>
                    ))}
                </Box>
              </Typography>
              {item?.avgRating && (
                <Typography className="max_rating">
                  Average Rating:
                  <Box sx={{ display: 'flex' }}>
                    {Array.from({ length: item?.avgRating }, (_, index) => (
                      <Box key={index}>
                        <GiRoundStar className="star-active" />
                      </Box>
                    ))}
                  </Box>
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </SingleCarousel>
      <Box className="carousel_topic">
        <SingleCarousel
          autoPlay={false}
          axis="vertical"
          infiniteLoop={true}
          showStatus={false}
          showThumbs={false}
          showArrows={true}
          showIndicators={false}
          className="carousel_small"
        >
          {listTopic?.map((item) => (
            <Box className="box_topic_small" key={item.id}>
              <img src={item.image} alt="topic" />
              <Box className="box_topic_content">
                <Typography>{item.topicChildrenName}.</Typography>
                <Typography>{item.shortDescription}</Typography>
                <Typography>
                  {formatDatePost(item.createdAt)} <FiberManualRecord /> 3K Views
                </Typography>
              </Box>
            </Box>
          ))}
        </SingleCarousel>
      </Box>
    </Box>
  );
};

export default TopicPopular;
