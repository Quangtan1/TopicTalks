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
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import chatStore from 'src/store/chatStore';
import ChatContext from 'src/context/ChatContext';
import { FaCarSide } from 'react-icons/fa';
import { ListMesage } from 'src/types/chat.type';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

const RandomDialog = observer((props: DialogProps) => {
  const { open, onClose } = props;
  const [selectTopic, setSelectTopic] = useState<number | ''>(1);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const [selected, setSelected] = useState<TopicChild>(null);
  const [isRandoming, setIsRandoming] = useState<boolean>(false);

  const chat = chatStore?.selectedChat;
  const { socket } = useContext(ChatContext);

  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    getDataAPI(`/topic-parent/all`, account.access_token, axiosJWT)
      .then((res) => {
        setListTopic(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (socket) {
      socket.on('partiAccess', (data: ListMesage) => {
        if (isMounted && data !== null) {
          setTimeout(() => {
            const isMatch = chatStore?.chats.some((item) => item.conversationInfor.id !== data.conversationInfor.id);
            const isNewConversation = chatStore?.chats.length === 0 || isMatch;
            if (isNewConversation) {
              setIsRandoming(false);
              chatStore?.setSelectedChat(data);
              ToastSuccess('You access random chat succesfully');
              chatStore?.setChats([...chatStore?.chats, data]);
              onClose();
            }
          }, 2000);
        }
      });
    }
    return () => {
      isMounted = false;
      if (socket) {
        socket.emit('onLeaveChatRandom');
      }
    };
  }, [chat]);

  useEffect(() => {
    getDataAPI(`/topic-children/topic-parent=${selectTopic}`, account.access_token, axiosJWT)
      .then((res) => {
        setTopicChild(res.data.data);
        setSelected(null);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectTopic]);

  const handleSelect = (topicChild: TopicChild) => {
    if (selected?.id === topicChild.id) {
      setSelected(null);
    } else {
      setSelected(topicChild);
    }
  };

  const handleRandom = () => {
    if (selected !== null) {
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

  return (
    <Dialog open={open} onClose={onClose} className="random_dialog">
      <DialogTitle className="dialog_title">
        <Typography>CREATE RANDOM CHAT</Typography>
        <Typography>New Conversation Random</Typography>
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
          <Box className="chat_name_box">
            <Typography>Please Choose Topic:</Typography>
          </Box>
          <Box className="topic_box">
            <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)}>
              {listTopic.length > 0 &&
                listTopic.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.topicParentName}
                  </MenuItem>
                ))}
            </Select>
            <Box className="topic_child">
              {topicChild.length > 0 &&
                topicChild?.map((item) => (
                  <Typography
                    key={item.id}
                    className={`${selected?.id === item.id && 'selected_topic'} topic_item`}
                    onClick={() => handleSelect(item)}
                  >
                    {item.topicChildrenName}
                  </Typography>
                ))}
            </Box>
          </Box>
        </DialogContent>
      )}

      <DialogActions className="dialog_action">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleRandom}>Random</Button>
      </DialogActions>
    </Dialog>
  );
});

export default RandomDialog;
