import React, { useEffect, useRef, useState } from 'react';
import './CreateGroupDialog.scss';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { aboutme, createAxios, getDataAPI, postDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import chatStore from 'src/store/chatStore';
import { useLocation, useNavigate } from 'react-router-dom';
import uiStore from 'src/store/uiStore';
import groupChat from 'src/assets/images/groupChat.svg';
import { RiLoader2Line } from 'react-icons/ri';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  topicChildProps?: TopicChild;
}

const CreateGroupDialog = observer((props: DialogProps) => {
  const { open, onClose, topicChildProps } = props;
  const [inputName, setInputName] = useState<string>('');
  const [selectTopic, setSelectTopic] = useState<number | ''>(1);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const [selected, setSelected] = useState<TopicChild>(null);
  const [page, setPage] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  const [isLoadTopic, setIsLoadTopic] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const account = accountStore?.account;

  const setAccount = (value) => {
    accountStore?.setAccount(value);
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

  const handleSelect = (topicChild: TopicChild) => {
    if (selected?.id === topicChild.id) {
      setSelected(null);
    } else {
      setSelected(topicChild);
    }
  };

  const createGroupChat = () => {
    if (inputName !== '' && selected) {
      uiStore?.setLoading(true);
      const groupData = {
        chatName: inputName,
        topicChildrenId: selected.id,
        adminId: account.id,
      };
      postDataAPI('/participant/create-group-chat', groupData, account.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess('Create Group Successfully');
          if (chatStore?.chats.length > 0) {
            chatStore?.setChats([res.data.data, ...chatStore?.chats]);
          } else {
            chatStore?.setChats([res.data.data]);
          }
          currentPath !== '/message' && navigate('/message');
          currentPath !== '/message'
            ? setTimeout(() => {
                chatStore.setSelectedChat(res.data.data);
                uiStore?.setLoading(false);
              }, 600)
            : chatStore.setSelectedChat(res.data.data);
          currentPath === '/message' && uiStore?.setLoading(false);
          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const disable = selected === null || inputName === '';

  return (
    <Dialog open={open} onClose={onClose} className="create_group_dialog">
      <DialogTitle className="dialog_title">
        <Typography>CREATE GROUP CHAT</Typography>
        <Typography>New Conversation</Typography>
      </DialogTitle>
      <DialogContent className="dialog_content">
        <img src={groupChat} alt="about" className="image" />
        <Box className="box_create">
          <Box className="chat_name_box">
            <Typography>Chat Name:</Typography>
            <TextField placeholder="Input here..." value={inputName} onChange={(e) => setInputName(e.target.value)} />
          </Box>
          {topicChildProps ? (
            <Box className="selected_topic">
              <Typography className="chat_name_box">Your Topic Selected:</Typography>
              <Typography>{topicChildProps?.topicChildrenName}</Typography>
              <span>______________________</span>
            </Box>
          ) : (
            <Box className="topic_box">
              <span>
                <Typography>Select Topic:</Typography>
                <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)}>
                  {listTopic?.length > 0 &&
                    listTopic?.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.topicParentName}
                      </MenuItem>
                    ))}
                </Select>
              </span>
              <Box className="topic_child" id="topic_child">
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
                {isLoadTopic && (
                  <Box className="load_topic">
                    <RiLoader2Line />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions className="dialog_action">
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={disable} className={disable && 'disable'} onClick={createGroupChat}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default CreateGroupDialog;
