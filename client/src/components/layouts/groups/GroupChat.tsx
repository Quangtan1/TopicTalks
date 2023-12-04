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
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import './GroupChat.scss';
import { BsArrowRight } from 'react-icons/bs';
import { RiLoader2Line } from 'react-icons/ri';

const content = 'Do you want to join this group?';
const GroupChat = observer(() => {
  const { id, name } = useParams();
  const [listGroup, setListGroup] = useState<ListMesage[]>([]);
  const [openWarning, setOpenWarning] = useState<boolean>(false);
  const navigate = useNavigate();
  const [groupId, setGroupId] = useState<number>(null);
  const [totalMeberGroup, setTotalMemberGroup] = useState<number>(null);
  const [page, setPage] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  const [isLoadGroup, setIsLoadGroup] = useState<boolean>(false);
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const total = scrollHeight - windowHeight;
    if (scrollTop >= total && total > 0) {
      setPage((prePage) => prePage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setIsLast(true);
      setPage(0);
    };
  }, [id]);

  useEffect(() => {
    const groupById = `/group-chat/${id}?&page=${page}&size=6`;
    const allGroupChat = `?is_groupchat=true&page=${page}&size=6`;
    if (isLast) {
      setIsLoadGroup(true);

      getDataAPI(`/participant${id === undefined ? allGroupChat : groupById}`, account?.access_token, axiosJWT)
        .then((res) => {
          const newGroup = res.data.data.content;
          page === 0 ? setListGroup(newGroup) : setListGroup([...listGroup, ...newGroup]);
          setIsLoadGroup(false);
          const lengthData = res.data.data.content.length;
          (lengthData === 0 || lengthData < 6) && setIsLast(false);
        })
        .catch((err) => {
          setIsLoadGroup(false);
          console.log(err);
        });
    }
  }, [page, id, isLast]);

  const isJoinGroup = (partnerDTO: IPartnerDTO[]) => {
    const result = partnerDTO.some((item) => item.id === account.id);
    return result;
  };
  const isMember = (partnerDTO: IPartnerDTO[]) => {
    const result = partnerDTO.some((item) => item.id === account.id && item.member);
    return result;
  };

  const joinGroupChat = (groudId: number, total: number) => {
    if (total < 30) {
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
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setOpenWarning(false);
      ToastError('This group has enough members');
    }
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

  const handleConfirm = (groudId: number, total: number) => {
    setGroupId(groudId);
    setTotalMemberGroup(total);
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
            List <strong>{name}</strong> Group Chats
          </Typography>
          <h2>How we can work together</h2>
        </Box>
        <Grid container className="group_container">
          {listGroup?.length > 0 &&
            listGroup?.map((item) => (
              <Grid item md={4} key={item.conversationInfor.id} className="group_box">
                <Card>
                  <CardMedia image={item.conversationInfor.avtGroupImg || imageGroup} className="image_group" />
                  <div className="overlay"></div>
                  <CardContent className="card_content">
                    <Typography>{item.conversationInfor.chatName}</Typography>
                    <Typography>Members - - {totalMember(item.partnerDTO)}/30 </Typography>
                    <Typography>{item.conversationInfor.topicChildren.topicChildrenName} </Typography>
                    <span>____________</span>
                  </CardContent>
                  <CardActions className="card_actions">
                    {isJoinGroup(item.partnerDTO) ? (
                      isMember(item.partnerDTO) ? (
                        <Button className="joined_before" onClick={() => handleJoinBefore(item)}>
                          Joined Before
                        </Button>
                      ) : (
                        <Button className="cancel" onClick={() => cancelJoin(item)}>
                          Cancel
                        </Button>
                      )
                    ) : (
                      <Button
                        className="join_group"
                        onClick={() => handleConfirm(item.conversationInfor.id, totalMember(item.partnerDTO))}
                      >
                        Join Group <BsArrowRight />
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
        {isLoadGroup && (
          <Box className="load_group">
            <RiLoader2Line />
          </Box>
        )}
      </Box>
      {openWarning && (
        <DialogCommon
          open={openWarning}
          content={content}
          onClose={() => setOpenWarning(false)}
          onConfirm={() => joinGroupChat(groupId, totalMeberGroup)}
        />
      )}
    </Box>
  );
});

export default GroupChat;
