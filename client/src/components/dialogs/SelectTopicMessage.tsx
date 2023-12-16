import { Box, Button, Dialog, DialogActions, DialogContent, MenuItem, Select, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import { createAxios, getDataAPI } from 'src/utils';
import './SelectTopicMessage.scss';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (topic: TopicChild) => void;
}
const SelectTopicMessage = observer((props: DialogProps) => {
  const { open, onClose, onConfirm } = props;
  const [selectTopic, setSelectTopic] = useState<number | ''>(1);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const [selected, setSelected] = useState<TopicChild>(null);

  const account = accountStore?.account;

  const setAccount = (value) => {
    accountStore?.setAccount(value);
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

  const handleCancel = () => {
    setSelected(null);
    onClose();
  };

  const handleAccess = () => {
    if (selected) {
      onConfirm(selected);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="select_topic_message_container">
      <DialogContent className="dialog_content">
        <Box className="chat_name_box">
          <Typography>Please Choose Topic:</Typography>
        </Box>
        <Box className="topic_box">
          <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)}>
            {listTopic?.length > 0 &&
              listTopic?.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.topicParentName}
                </MenuItem>
              ))}
          </Select>
          <Box className="topic_child">
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
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="dialog_action">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={handleAccess}
          disabled={selected === null}
          className={`${selected === null && 'disable_button'}`}
        >
          Access
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default SelectTopicMessage;
