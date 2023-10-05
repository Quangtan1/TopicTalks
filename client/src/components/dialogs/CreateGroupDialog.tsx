import React, { useEffect, useState } from 'react';
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
import { createAxios, getDataAPI, postDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import chatStore from 'src/store/chatStore';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateGroupDialog = observer((props: DialogProps) => {
  const { open, onClose } = props;
  const [inputName, setInputName] = useState<string>('');
  const [selectTopic, setSelectTopic] = useState<number | ''>(1);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const [selected, setSelected] = useState<TopicChild>(null);

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
    getDataAPI(`/topic-children/topic-parent=${selectTopic}`, account.access_token, axiosJWT)
      .then((res) => {
        setTopicChild(res.data.data);
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

  const createGroupChat = () => {
    if (inputName !== '' && selected) {
      const groupData = {
        chatName: inputName,
        topicChildrenId: selected.id,
        adminId: account.id,
      };
      postDataAPI('/participant/create-group-chat', groupData, account.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess('Create Group Sucessfully');
          chatStore?.setChats([...chatStore?.chats, res.data.data]);
          chatStore.setSelectedChat(res.data.data);
          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // const joinGroupChat = () => {
  //   const groupData = {};
  //   postDataAPI(`/participant/join-group-chat/uid=${account.id}&&cid=${1}`, groupData, account.access_token, axiosJWT)
  //     .then((res) => {
  //       ToastSuccess('Join Group Sucessfully');
  //       console.log(res.data.data);
  //       onClose();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <Dialog open={open} onClose={onClose} className="create_group_dialog">
      <DialogTitle className="dialog_title">
        <Typography>CREATE GROUP CHAT</Typography>
        <Typography>New Conversation</Typography>
      </DialogTitle>
      <DialogContent className="dialog_content">
        <Box className="chat_name_box">
          <Typography>Chat Name:</Typography>
          <TextField placeholder="Enter Chat Name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
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
      <DialogActions className="dialog_action">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={createGroupChat}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
});

export default CreateGroupDialog;
