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

  const handleDiscoveryGroupClick = () => {
    groupChatRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const isJoinGroup = (partnerDTO: IPartnerDTO[]) => {
    const result = partnerDTO.some((item) => item.id === account.id);
    return result;
  };
  const isMember = (partnerDTO: IPartnerDTO[]) => {
    const result = partnerDTO.some((item) => item.id === account.id && item.member);
    return result;
  };

  const joinGroupChat = (groudId: number) => {
    // uiStore?.setLoading(true);
    const groupData = {};
    postDataAPI(
      `/participant/join-group-chat/uid=${account.id}&&cid=${groudId}`,
      groupData,
      account?.access_token,
      axiosJWT,
    )
      .then((res) => {
        ToastSuccess('Waiting Approve from Admin');
        const index = listGroup?.findIndex((item) => item.conversationInfor.id === groudId);

        setListGroup((prev) => {
          prev[index] = res.data.data;
          return [...prev];
        });
        setOpenWarning(false);
        // navigate('/message');
        // setTimeout(() => {
        //   // chatStore?.setChats([res.data.data, ...chatStore?.chats]);
        //   chatStore?.setSelectedChat(res.data.data);
        //   uiStore?.setLoading(false);
        // }, 400);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleJoinBefore = (selectedChat: ListMesage) => {
    uiStore?.setLoading(true);
    navigate('/message');
    setTimeout(() => {
      const isMember = selectedChat.partnerDTO.filter((item) => item.id === account?.id).some((item) => item.member);
      chatStore?.setSelectedChat({ ...selectedChat, isMember: isMember.toString() });
      uiStore?.setLoading(false);
    }, 200);
  };

  const cancelJoin = (chat: ListMesage) => {
    deleteDataAPI(
      `/participant/remove-member?aid=${chat.conversationInfor.adminId}&uid=${account.id}&cid=${chat?.conversationInfor.id}`,
      account.access_token,
      axiosJWT,
    )
      .then((res) => {
        const index = listGroup?.findIndex((item) => item.conversationInfor.id === chat?.conversationInfor.id);
        const newPartner = chat?.partnerDTO.filter((item) => item.id !== account.id);
        setListGroup((prev) => {
          const updatedChat = {
            ...chat,
            partnerDTO: newPartner,
          };
          prev[index] = updatedChat;
          return [...prev];
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirm = (groudId: number) => {
    setGroupId(groudId);
    setOpenWarning(true);
  };

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

      {/* <Box className="box_group_chat" ref={groupChatRef}>
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
          {listGroup?.length > 0 &&
            listGroup?.map((item) => (
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
                      isMember(item.partnerDTO) ? (
                        <Button className="joined_before" onClick={() => handleJoinBefore(item)}>
                          Joined Before
                        </Button>
                      ) : (
                        <Button className="joined_before" onClick={() => cancelJoin(item)}>
                          Cancel
                        </Button>
                      )
                    ) : (
                      <Button className="join_group" onClick={() => handleConfirm(item.conversationInfor.id)}>
                        Join Group
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box> */}
      {/* {openWarning && (
        <DialogCommon
          open={openWarning}
          content={content}
          onClose={() => setOpenWarning(false)}
          onConfirm={() => joinGroupChat(groupId)}
        />
      )} */}
      {open && <CreateGroupDialog open={open} onClose={() => setOpen(false)} />}
    </Grid>
  );
});

export default TopicChildDetail;
