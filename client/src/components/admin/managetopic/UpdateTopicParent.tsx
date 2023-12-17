import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import './UpdateTopicParent.scss';
import { createAxios, putDataAPI } from 'src/utils';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import uiStore from 'src/store/uiStore';
import { FaImage } from 'react-icons/fa';
import { handleImageUpload } from 'src/utils/helper';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  topic: ListTopic;
  setTopicParent: React.Dispatch<React.SetStateAction<ListTopic>>;
}
const UpdateTopicParent = observer((props: DialogProps) => {
  const { open, onClose, topic, setTopicParent } = props;
  const [newName, setNewName] = useState<string>('');
  const [shortDescript, setNewDescript] = useState<string>('');
  const [imageFile, setImageFile] = useState<string>('');
  const fileInputRef = useRef(null);
  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleConfirm = () => {
    if (topic?.topicParentName !== newName || topic?.shortDescript !== shortDescript || imageFile !== '') {
      const data = {
        topicName: newName || topic?.topicParentName,
        shortDescript: shortDescript || topic?.shortDescript,
        urlImage: imageFile || topic?.image,
      };
      putDataAPI(`/topic-parent/update?id=${topic?.id}`, data, account.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess('Update Successfully!');
          setTopicParent(res.data.data);
          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ToastError('Please input not simmilar old content topic');
    }
  };
  useEffect(() => {
    setNewName(topic?.topicParentName);
    setNewDescript(topic?.shortDescript);
  }, []);

  useEffect(() => {
    if (imageFile === 'err') {
      uiStore?.setLoading(false);
      setImageFile('');
    } else {
      uiStore?.setLoading(false);
    }
  }, [imageFile]);

  const handleLinkClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={open} onClose={onClose} className="dialog_update_topic_parent">
      <DialogTitle className="dialog_title">Update Primary Topic</DialogTitle>
      <DialogContent className="dialog_content">
        <Typography>Change topic content:</Typography>
        <TextField
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          fullWidth
          placeholder="Input Topic Name"
        />
        <TextField
          multiline
          value={shortDescript}
          onChange={(e) => setNewDescript(e.target.value)}
          fullWidth
          placeholder="Input Short Description"
        />

        <Box className="add_image_child">
          <Typography>Change Image: </Typography>
          <FaImage onClick={handleLinkClick} />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: ' none' }}
            onChange={(e) => {
              handleImageUpload(e.target.files, setImageFile, true);
              uiStore?.setLoading(true);
            }}
          />
        </Box>
        <img src={imageFile || topic?.image} alt="img" loading="lazy" />
      </DialogContent>
      <DialogActions className="dialog_action">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} disabled={newName === '' && shortDescript === ''}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UpdateTopicParent;
