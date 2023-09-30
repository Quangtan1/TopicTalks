import React, { useEffect, useRef, useState } from 'react';
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
  Typography,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { observer } from 'mobx-react';
import { createAxios, getDataAPI, postDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ToastSuccess } from 'src/utils/toastOptions';
import { IoDocumentAttachSharp } from 'react-icons/io5';
import uiStore from 'src/store/uiStore';
import { handleImageUpload } from 'src/utils/helper';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ListTopic } from 'src/types/topic.type';

interface DialogProps {
  open: boolean;
  onClose: () => void;
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
  const [imageFile, setImageFile] = useState<string>('');
  const fileInputRef = useRef(null);
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
      topicParentId: selectTopic,
      topicChildrenName: topicChild,
      image: imageFile,
    };
    if (active === 1 ? topicPrimary !== '' : topicChild !== '' && imageFile !== '') {
      postDataAPI(
        `${active === 1 ? '/topic-parent/create' : '/topic-children/create'}`,
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
    if (imageFile !== '') {
      uiStore?.setLoading(false);
    }
  }, [imageFile]);

  useEffect(() => {
    getDataAPI(`/topic-parent/all`, account.access_token, axiosJWT)
      .then((res) => {
        setListTopic(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLinkClick = () => {
    fileInputRef.current.click();
  };

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
          <>
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
            <Box className="add_image_child">
              <Typography>Add Topic Child Image: </Typography>
              <IoDocumentAttachSharp onClick={handleLinkClick} />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: ' none' }}
                onChange={(e) => {
                  handleImageUpload(e.target.files, setImageFile, true);
                  uiStore?.setLoading(true);
                }}
              />
              {imageFile !== '' && (
                <Typography>
                  {imageFile.slice(0, 16)} <AiOutlineCloseCircle onClick={() => setImageFile('')} />
                </Typography>
              )}
            </Box>
          </>
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
