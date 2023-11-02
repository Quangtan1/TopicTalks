import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import accountStore from 'src/store/accountStore';
import chatStore from 'src/store/chatStore';
import uiStore from 'src/store/uiStore';
import { IPartnerDTO, ListMesage } from 'src/types/chat.type';
import { createAxios, deleteDataAPI, getDataAPI, imageGroup, postDataAPI } from 'src/utils';
import { ToastSuccess } from 'src/utils/toastOptions';
import './GroupChat.scss';
import { TopicChild } from 'src/types/topic.type';

const content = 'Do you want to join this group?';
const GroupChat = observer(() => {
  const { id } = useParams();
  const [topicChild, setTopicChild] = useState<TopicChild>(null);
  const [listGroup, setListGroup] = useState<ListMesage[]>([]);
  const [openWarning, setOpenWarning] = useState<boolean>(false);
  const navigate = useNavigate();
  const [groupId, setGroupId] = useState<number>(null);
  const account = accountStore?.account;
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
    getDataAPI(`/participant/group-chat/${id}`, account?.access_token, axiosJWT)
      .then((res) => {
        setListGroup(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

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

  const totalMember = (partner: IPartnerDTO[]) => {
    const arr = [];
    partner.forEach((item) => {
      if (item.member) {
        arr.push(item);
      }
    });
    return arr.length;
  };

  return (
    <Box className="group_chat_container">
      <Box className="box_group_chat">
        <Box className="title_box">
          <Typography className="title_topic">
            List <strong>{topicChild?.topicChildrenName}</strong> Group Chats
          </Typography>
          <h2>How we can work together</h2>
        </Box>
        <Grid container className="group_container">
          {listGroup?.length > 0 &&
            listGroup?.map((item) => (
              <Grid item md={4} key={item.conversationInfor.id} className="group_box">
                <Card>
                  <CardMedia image={imageGroup} className="image_group" />
                  <div className="overlay"></div>
                  <CardContent className="card_content">
                    <Typography>{item.conversationInfor.chatName}</Typography>
                    <Typography>{totalMember(item.partnerDTO)}/30 Members</Typography>
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
      </Box>
      {openWarning && (
        <DialogCommon
          open={openWarning}
          content={content}
          onClose={() => setOpenWarning(false)}
          onConfirm={() => joinGroupChat(groupId)}
        />
      )}
    </Box>
  );
});

export default GroupChat;
