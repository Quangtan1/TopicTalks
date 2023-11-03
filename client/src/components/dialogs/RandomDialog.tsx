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
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import chatStore from 'src/store/chatStore';
import { FaCarSide } from 'react-icons/fa';
import { ListMesage } from 'src/types/chat.type';
import { io } from 'socket.io-client';
import ChatContext from 'src/context/ChatContext';

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

  const account = accountStore?.account;

  const { isRandoming, setIsRandoming, socket } = useContext(ChatContext);
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
          <img src={partner} alt="partner" className="partner" />
          <Box className="box_random">
            <Typography className="chat_name_box">Please Choose Topic:</Typography>
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
          </Box>
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
