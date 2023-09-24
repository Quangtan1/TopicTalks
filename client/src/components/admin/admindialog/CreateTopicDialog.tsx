import React, { useEffect, useState } from 'react';
import './CreateTopicDialog.scss';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { AiOutlineCodepen } from 'react-icons/ai';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { observer } from 'mobx-react';
import { API_KEY, createAxios, getDataAPI, postDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import axios from 'axios';
import { ToastSuccess } from 'src/utils/toastOptions';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}
interface ListTopic {
  id: number;
  topicParentName: string;
}
const tabOptions = [
  { id: 1, label: 'New Primary Topic' },
  { id: 2, label: 'New Children Topic' },
];

const CreateTopicDialog = observer((props: DialogProps) => {
  const { open, onClose } = props;
  const [active, setActive] = useState(1);
  const [selectTopic, setSelectTopic] = useState<number>(1);
  const [topicPrimary, setTopicPrimary] = useState<string>('');
  const [topicChild, setTopicChild] = useState<string>('');
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const createTopic = () => {
    const topic = {
      topicParentName: topicPrimary,
    };
    const topicChildParam = {
      topicParentId: 1,
      topicChildrenName: topicChild,
    };
    if (active === 1 ? topicPrimary !== '' : topicChild !== '') {
      postDataAPI(
        `${active === 1 ? 'topic-parent/create' : 'topic-children/create'}`,
        active === 1 ? topic : topicChildParam,
        account.access_token,
        axiosJWT,
      )
        .then((res) => {
          ToastSuccess('Create Topic Successfully');
          console.log('dataaa', res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    getDataAPI(`${API_KEY}/topic-parent/all`, account.access_token, axiosJWT)
      .then((res) => {
        setListTopic(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Dialog open={open} onClose={onClose} className="topic_dialog_container">
      <DialogTitle className="dialog_title">
        Create Topic <CloseRounded onClick={onClose} />
      </DialogTitle>
      <DialogContent className="dialog_content">
        <Box className="tab_option">
          {tabOptions.map((option) => (
            <Typography
              key={option.id}
              className={`${active === option.id && 'active'}`}
              onClick={() => setActive(option.id)}
            >
              {option.label}
            </Typography>
          ))}
        </Box>
        <Box className="primary_topic">
          <Typography>The Primary Topic:</Typography>
          {active === 1 ? (
            <Input
              placeholder="Input your primary topic"
              className="text_field"
              value={topicPrimary}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                setTopicPrimary(e.target.value);
              }}
            />
          ) : (
            <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)}>
              {listTopic.length > 0 &&
                listTopic.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.topicParentName}
                  </MenuItem>
                ))}
            </Select>
          )}
        </Box>
        {active === 2 && (
          <Box className="child_topic">
            <Typography>The Children Topic:</Typography>
            <Input
              placeholder="Input your children topic"
              value={topicChild}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                setTopicChild(e.target.value);
              }}
            />
          </Box>
        )}

        <Box className="warning">
          <MdOutlineErrorOutline />
          <Typography>Please avoid duplicating similar topics</Typography>
        </Box>
      </DialogContent>
      <DialogActions className="dialog_action">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={createTopic}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
});

export default CreateTopicDialog;
