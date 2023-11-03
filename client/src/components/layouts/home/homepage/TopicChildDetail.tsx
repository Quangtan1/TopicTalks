import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import accountStore from 'src/store/accountStore';
import { TopicChild } from 'src/types/topic.type';
import { createAxios, deleteDataAPI, getDataAPI, imageGroup, postDataAPI, topicdetail } from 'src/utils';
import './TopicChildDetail.scss';
import CreateGroupDialog from 'src/components/dialogs/CreateGroupDialog';
import { IPartnerDTO, ListMesage } from 'src/types/chat.type';
import { ToastSuccess } from 'src/utils/toastOptions';
import chatStore from 'src/store/chatStore';
import uiStore from 'src/store/uiStore';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { AiOutlineArrowRight } from 'react-icons/ai';

const content = 'Are you sure you want to join this group?';

const TopicChildDetail = observer(() => {
  const { id } = useParams();
  const [topicChild, setTopicChild] = useState<TopicChild>(null);
  const [listGroup, setListGroup] = useState<ListMesage[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openWarning, setOpenWarning] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<number>(null);
  const account = accountStore?.account;
  const navigate = useNavigate();

  const groupChatRef = useRef(null);

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
    // getDataAPI(`/participant/group-chat/${id}`, account?.access_token, axiosJWT)
    //   .then((res) => {
    //     setListGroup(res.data.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, [id]);

  return (
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
          <Button>FINDING RANDOM PARTNER</Button>
        </Box>
        <Typography className="title_existing">Finding existing groups</Typography>
        <Button className="view_group" onClick={() => navigate(`/group-chat/${id}`)}>
          VIEW GROUP CHAT <AiOutlineArrowRight />
        </Button>
      </Grid>
      {open && <CreateGroupDialog open={open} onClose={() => setOpen(false)} />}
    </Grid>
  );
});

export default TopicChildDetail;
