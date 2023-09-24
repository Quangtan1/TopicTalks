import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import './TopicChildren.scss';
import { useParams } from 'react-router-dom';
import uiStore from 'src/store/uiStore';
import Loading from 'src/components/loading/Loading';
import { BiArrowToTop } from 'react-icons/bi';
import { observer } from 'mobx-react';
import GroupChatBox from './groupChatBox/GroupChatBox';

const topicChildren = {
  createdAt: '2023-09-24T16:56:35.205249',
  updatedAt: '2023-09-24T16:56:35.205249',
  id: 4,
  topicChildrenName: 'Love Story',
  urlImage:
    'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/02/hinh-anh-i-love-you-bang-tay.jpg?w=391&h=220&ssl=1',
};

const TopicChildren = observer(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams<{ id: string }>();
  const isResize = uiStore?.collapse;
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 250) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    uiStore?.setLoading(false);
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {uiStore?.loading ? (
        <Loading />
      ) : (
        <Grid
          container
          spacing={2}
          className={`container-topic-child ${isResize ? 'expand_topic-child' : 'collapse_topic-child'}`}
        >
          <Grid item xs={12} md={12}>
            <Box className="topic-children">
              <img src={topicChildren?.urlImage} alt="" />
              <Typography variant="h4" className="topic-title">
                {topicChildren?.topicChildrenName}
              </Typography>
              <Typography variant="h6" className="topic-description">
                This is a lovely topic about {topicChildren?.topicChildrenName}.
              </Typography>
            </Box>
            <GroupChatBox topicChild={topicChildren} />
          </Grid>
          {isVisible && (
            <Button className="scroll-to-top" onClick={scrollToTop}>
              <BiArrowToTop />
            </Button>
          )}
        </Grid>
      )}
    </>
  );
});

export default TopicChildren;
