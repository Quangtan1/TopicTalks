import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './UpdateTopicDialog.scss';
import { createAxios, putDataAPI } from 'src/utils';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { TopicChild } from 'src/types/topic.type';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  topic: TopicChild;
  setTopicChild: React.Dispatch<React.SetStateAction<TopicChild[]>>;
  topicParentId: number;
}
const UpdateTopicDialog = observer((props: DialogProps) => {
  const { open, onClose, topic, setTopicChild, topicParentId } = props;
  const [newName, setNewName] = useState<string>('');
  const [shortDescript, setNewDescript] = useState<string>('');
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleConfirm = () => {
    if (topic?.topicChildrenName !== newName || topic?.shortDescript !== shortDescript) {
      const data = {
        newName: newName || topic?.topicChildrenName,
        shortDescript: shortDescript || topic?.shortDescript,
      };
      putDataAPI(`/topic-children/update?pid=${topicParentId}&&cid=${topic?.id}`, data, account.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess('Update Succesfully');
          setTopicChild((prev) =>
            prev.map((item) =>
              item.id === topic?.id
                ? { ...item, topicChildrenName: data.newName, shortDescript: data.shortDescript }
                : item,
            ),
          );
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
    setNewName(topic?.topicChildrenName);
    setNewDescript(topic?.shortDescript);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} className="dialog_update_topic">
      <DialogTitle className="dialog_title">Update Topic</DialogTitle>
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

export default UpdateTopicDialog;
