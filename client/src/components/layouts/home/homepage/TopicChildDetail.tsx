import { Box, Button, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import accountStore from 'src/store/accountStore';
import { RatingByTopicChild, TopicChild } from 'src/types/topic.type';
import { createAxios, getDataAPI, topicdetail } from 'src/utils';
import './TopicChildDetail.scss';
import CreateGroupDialog from 'src/components/dialogs/CreateGroupDialog';
import { AiOutlineArrowRight } from 'react-icons/ai';
import ChatContext from 'src/context/ChatContext';
import RandomDialog from 'src/components/dialogs/RandomDialog';
import LazyShow from '../../LandingView/Animated/LazyShow';
import { GiRoundStar } from 'react-icons/gi';
import Rating from './rating/Rating';

const TopicChildDetail = observer(() => {
  const { id } = useParams();
  const [topicChild, setTopicChild] = useState<TopicChild>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { openRandom, setOpenRandom } = useContext(ChatContext);
  const [openRating, setOpenRating] = useState<boolean>(false);
  const [ratingThisTopic, setRatingThisTopic] = useState<RatingByTopicChild>(null);
  const account = accountStore?.account;
  const navigate = useNavigate();

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);
  useEffect(() => {
    getDataAPI(`/topic-children/${id}`, account?.access_token, axiosJWT)
      .then((res) => {
        setTopicChild(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    getDataAPI(`/ratings/all/usr/${accountJwt?.id}/tpc/${id}`, account?.access_token, axiosJWT)
      .then((res) => {
        setRatingThisTopic(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <LazyShow>
      <Box className="container_topic_child">
        <Box className="title_topic_child">
          <Typography>Detail of Topic</Typography>
          <Typography>
            List Topic {`>`} {topicChild?.topicChildrenName} Topic
          </Typography>
        </Box>
        <Grid container className="topic_child_container">
          <Grid item md={6} className="box_image_topic">
            <img src={topicdetail} alt="topic" className="backgroup_topic" />
            <div className="overlay" />
            <img src={topicChild?.image} alt="img" className="image_topic" />
          </Grid>
          <Grid item md={6} className="box_topic_child">
            <Typography>MAKE YOUR EMOTION FUN</Typography>
            <Typography className="title_topic">{topicChild?.topicChildrenName}</Typography>
            <Typography className="sologan_topic">{topicChild?.shortDescript}</Typography>
            <Typography className="title_option">Create your own conversation with this topic:</Typography>

            <Box className="box_create">
              <Button onClick={() => setOpen(true)}>CREATE YOUR GROUP CHAT</Button>
              <Button onClick={() => setOpenRandom(true)}>FINDING RANDOM PARTNER</Button>
            </Box>
            <Typography className="title_existing">Finding existing groups</Typography>
            <Button
              className="view_group"
              onClick={() => navigate(`/group-chat/${id}/${topicChild?.topicChildrenName}`)}
            >
              VIEW GROUP CHAT <AiOutlineArrowRight />
            </Button>
            <Box className="rating" onClick={() => setOpenRating(true)}>
              {ratingThisTopic?.rating ? (
                Array.from({ length: ratingThisTopic?.rating }, (_, index) => (
                  <Box key={index}>
                    <GiRoundStar className="star-active" />
                  </Box>
                ))
              ) : (
                <>
                  <GiRoundStar />
                  <GiRoundStar />
                  <GiRoundStar />
                  <GiRoundStar />
                  <GiRoundStar />
                </>
              )}
            </Box>
          </Grid>
          {open && <CreateGroupDialog open={open} onClose={() => setOpen(false)} topicChildProps={topicChild} />}
          {openRandom && (
            <RandomDialog open={openRandom} onClose={() => setOpenRandom(false)} topicChildProps={topicChild} />
          )}
          {openRating && <Rating open={openRating} onClose={() => setOpenRating(false)} tpcId={id} />}
        </Grid>
      </Box>
    </LazyShow>
  );
});

export default TopicChildDetail;
