import React, { useEffect, useState, useContext } from 'react';
import './RandomDialog.scss';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { createAxios, getDataAPI, partner } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import chatStore from 'src/store/chatStore';
import { FaCarSide } from 'react-icons/fa';
import { ListMesage } from 'src/types/chat.type';
import { io } from 'socket.io-client';
import ChatContext from 'src/context/ChatContext';
import { useLocation, useNavigate } from 'react-router-dom';
import findsvg from 'src/assets/images/findsvg.svg';
import { RiLoader2Line } from 'react-icons/ri';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  topicChildProps?: TopicChild;
}
const RandomDialog = observer((props: DialogProps) => {
  const { open, onClose, topicChildProps } = props;
  const [selectTopic, setSelectTopic] = useState<number | ''>(1);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const [selected, setSelected] = useState<TopicChild>(null);
  const [page, setPage] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  const [isLoadTopic, setIsLoadTopic] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(30);
  const selectedChat = chatStore?.selectedChat;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const account = accountStore?.account;

  const { isRandoming, setIsRandoming, socket } = useContext(ChatContext);
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleScroll = () => {
    const boxChild = document.querySelector('#topic_child');
    const scrollTop = boxChild.scrollTop;
    const scrollHeight = boxChild.scrollHeight;
    const windowHeight = boxChild.clientHeight;
    const total = scrollHeight - windowHeight;
    if (scrollTop >= total - 0.21 && total > 0) {
      setPage((prePage) => prePage + 1);
    }
  };

  useEffect(() => {
    if (topicChildProps) {
      setSelected(topicChildProps);
    } else {
      getDataAPI(`/topic-parent/all-tparent?isDisable=false`, account.access_token, axiosJWT)
        .then((res) => {
          setListTopic(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const fetchApi = (pageValue: number) => {
    return getDataAPI(
      `/topic-children?tpid=${selectTopic}&&is_expired=false&page=${pageValue}&size=5`,
      account.access_token,
      axiosJWT,
    );
  };

  useEffect(() => {
    return () => {
      if (selected !== null) {
        const topicChildren = {
          userId: account.id,
          targetName: 'null',
          username: account.username,
          timeAt: new Date().toISOString(),
          targetId: account.id,
          conversationId: 0,
          data: {
            id: selected?.id,
          },
        };
        socket.emit('onLeaveChatRandom', topicChildren);
      }
    };
  }, [open]);

  useEffect(() => {
    if (selectTopic && selectedChat !== null && currentPath !== '/message') {
      navigate('/message');
      setTimeout(() => {
        chatStore.setSelectedChat(selectedChat);
      }, 500);
    }
  }, [selectedChat]);

  useEffect(() => {
    const boxChild = document.querySelector('#topic_child');
    boxChild && boxChild.addEventListener('scroll', handleScroll);
    if (!topicChildProps) {
      fetchApi(0)
        .then((res) => {
          setTopicChild(res.data.data.content);
          setSelected(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      boxChild && boxChild.removeEventListener('scroll', handleScroll);
      setIsLast(true);
      setPage(0);
    };
  }, [selectTopic]);

  useEffect(() => {
    if (page !== 0 && isLast) {
      setIsLoadTopic(true);
      fetchApi(page)
        .then((res) => {
          const newTopic = res.data.data.content;
          setTopicChild((prevTopic) => [...prevTopic, ...newTopic]);
          const lengthData = res.data.data.content.length;
          (lengthData === 0 || lengthData < 5) && setIsLast(false);
          setIsLoadTopic(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoadTopic(false);
        });
    }
  }, [page]);

  useEffect(() => {
    if (isRandoming) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0 && selected !== null && socket) {
            const topicChildren = {
              userId: account.id,
              targetName: 'null',
              username: account.username,
              timeAt: new Date().toISOString(),
              targetId: account.id,
              conversationId: 0,
              data: {
                id: selected?.id,
              },
            };
            setIsRandoming(false);
            setSeconds(30);
            socket.emit('onLeaveChatRandom', topicChildren);
            setSelected(null);
            ToastError('No partner found');
          }

          return prevSeconds - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isRandoming]);

  const handleSelect = (topicChild: TopicChild) => {
    if (selected?.id === topicChild.id) {
      setSelected(null);
    } else {
      setSelected(topicChild);
    }
  };

  const handleRandom = () => {
    if (selected !== null && socket) {
      setIsRandoming(true);
      const topicChildren = {
        userId: account.id,
        targetName: 'null',
        username: account.username,
        timeAt: new Date().toISOString(),
        targetId: account.id,
        conversationId: 0,
        data: {
          id: selected.id,
        },
      };
      socket.emit('onAccessChatRandom', topicChildren);
    }
  };

  const handleCancel = () => {
    setIsRandoming(false);
    setSelected(null);
    if (selected !== null && socket) {
      const topicChildren = {
        userId: account.id,
        targetName: 'null',
        username: account.username,
        timeAt: new Date().toISOString(),
        targetId: account.id,
        conversationId: 0,
        data: {
          id: selected?.id,
        },
      };
      socket.emit('onLeaveChatRandom', topicChildren);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} className="random_dialog">
      <DialogTitle className="dialog_title">
        <Typography>LOOKING FOR A PARTNER</Typography>
        <Typography>New Conversation</Typography>
      </DialogTitle>
      {isRandoming ? (
        <DialogContent className="loading">
          <span className="animate_icon">
            ooo
            <FaCarSide />
          </span>
          <div />
          <Typography>Finding...</Typography>
        </DialogContent>
      ) : (
        <DialogContent className="dialog_content">
          <img src={findsvg} alt="partner" className="partner" />
          {topicChildProps ? (
            <Box className="selected_topic">
              <Typography className="chat_name_box">Your Topic Selected:</Typography>
              <Typography>{topicChildProps?.topicChildrenName}</Typography>
              <span>______________________</span>
            </Box>
          ) : (
            <Box className="box_random">
              <Typography className="chat_name_box">Please Choose Topic:</Typography>
              <Box className="topic_box">
                <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)}>
                  {listTopic?.length > 0 &&
                    listTopic?.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.topicParentName}
                      </MenuItem>
                    ))}
                </Select>
                <Box className="topic_child" id="topic_child">
                  {topicChild?.length > 0 &&
                    topicChild?.map((item) => (
                      <Typography
                        key={item.id}
                        className={`${selected?.id === item.id && 'selected_topic'} topic_item`}
                        onClick={() => handleSelect(item)}
                      >
                        {item.topicChildrenName}
                      </Typography>
                    ))}
                  {isLoadTopic && (
                    <Box className="load_topic">
                      <RiLoader2Line />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      )}

      <DialogActions className="dialog_action">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          disabled={selected === null || isRandoming}
          onClick={handleRandom}
          className={`${(selected === null || isRandoming) && 'disable_button'}`}
        >
          Random
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default RandomDialog;
