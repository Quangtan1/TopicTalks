import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import accountStore from 'src/store/accountStore';
import { TopicChild } from 'src/types/topic.type';
import { createAxios, getDataAPI, imageGroup, postDataAPI } from 'src/utils';
import './TopicChildDetail.scss';
import CreateGroupDialog from 'src/components/dialogs/CreateGroupDialog';
import { IPartnerDTO, ListMesage } from 'src/types/chat.type';
import { ToastSuccess } from 'src/utils/toastOptions';
import chatStore from 'src/store/chatStore';
import uiStore from 'src/store/uiStore';

const TopicChildDetail = observer(() => {
  const { id } = useParams();
  const [topicChild, setTopicChild] = useState<TopicChild>(null);
  const [listTopicChild, setListTopicChild] = useState<ListMesage[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const account = accountStore?.account;
  const navigate = useNavigate();

  const groupChatRef = useRef(null);

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);
  useEffect(() => {
    getDataAPI(`/topic-children/${id}`, account.access_token, axiosJWT)
      .then((res) => {
        setTopicChild(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getDataAPI(`/participant/group-chat/${id}`, account.access_token, axiosJWT)
      .then((res) => {
        setListTopicChild(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleDiscoveryGroupClick = () => {
    groupChatRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const isJoinGroup = (partnerDTO: IPartnerDTO[]) => {
    const result = partnerDTO.some((item) => item.id === account.id);
    return result;
  };

  const joinGroupChat = (groudId: number) => {
    uiStore?.setLoading(true);
    const groupData = {};
    postDataAPI(
      `/participant/join-group-chat/uid=${account.id}&&cid=${groudId}`,
      groupData,
      account.access_token,
      axiosJWT,
    )
      .then((res) => {
        ToastSuccess('Join Group Sucessfully');
        navigate('/message');
        setTimeout(() => {
          chatStore?.setSelectedChat(res.data.data);
          uiStore?.setLoading(false);
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box className="topic_child_container">
      <Box className="box_topic_child">
        <Typography className="title_topic">{topicChild?.topicChildrenName}</Typography>
        <Typography className="sologan_topic">
          Engage in <strong className="highlight_text">Unrestricted conversations</strong>, exploring the world through
          <strong className="highlight_text"> various preferred topics </strong> while maintaining anonymous
          connections.
        </Typography>
        <Box className="box_image">
          <Box className="button_option">
            <Button onClick={handleDiscoveryGroupClick}>Discovery Group</Button>
            <Button>More</Button>
          </Box>
          <img src={topicChild?.image} alt="img" className="image_topic" />
        </Box>
      </Box>
      <Box className="box_group_chat" ref={groupChatRef}>
        <Box className="title_box">
          <Typography className="title_backgroup">Group Chat</Typography>
          <Typography className="title_group">
            <strong>Discovery</strong> Group Chat
          </Typography>
        </Box>
        <Button className="create_group" onClick={() => setOpen(true)}>
          Create Your Own Group
        </Button>
        <Grid container className="group_container">
          {listTopicChild?.length > 0 &&
            listTopicChild?.map((item) => (
              <Grid item md={4} key={item.conversationInfor.id} className="group_box">
                <Card>
                  <CardMedia image={imageGroup} className="image_group" />
                  <div className="overlay"></div>
                  <CardContent className="card_content">
                    <Typography>{item.conversationInfor.chatName}</Typography>
                    <Typography>{item.partnerDTO.length}/30</Typography>
                  </CardContent>
                  <CardActions className="card_actions">
                    {isJoinGroup(item.partnerDTO) ? (
                      <Button className="joined_before">Joined Before</Button>
                    ) : (
                      <Button className="join_group" onClick={() => joinGroupChat(item.conversationInfor.id)}>
                        Join Group
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
      {open && <CreateGroupDialog open={open} onClose={() => setOpen(false)} />}
    </Box>
  );
});

export default TopicChildDetail;
