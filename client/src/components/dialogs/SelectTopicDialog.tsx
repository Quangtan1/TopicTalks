import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from '@mui/material';
import React, { useEffect, useState, memo } from 'react';
import './SelectTopicDialog.scss';
import axios from 'axios';
import { IUser } from 'src/types/account.types';
import { API_KEY } from 'src/utils';
import { ToastSuccess } from 'src/utils/toastOptions';
import select from 'src/assets/images/select.svg';

interface DialogProps {
  open: boolean;
  accountSignup: IUser;
  onClose: () => void;
}

interface ListTopic {
  id: number;
  topicParentName: string;
}
const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const SelectTopicDialog = (props: DialogProps) => {
  const { open, accountSignup, onClose } = props;
  const [selectedTopic, setSelectedTopic] = useState<number[]>([]);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);

  useEffect(() => {
    axios
      .get(`${API_KEY}/topic-parent/all-tparent?isDisable=false`, {
        headers: { Authorization: `Bearer ${accountSignup?.access_token}` },
      })
      .then((res) => {
        if (res.data.data !== 'Not exist any children topic.') {
          setListTopic(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accountSignup]);

  const handleSelectTopic = (topicId: number) => {
    if (selectedTopic.includes(topicId)) {
      const newSelectedTopic = selectedTopic.filter((itemId) => itemId !== topicId);
      setSelectedTopic(newSelectedTopic);
    } else {
      setSelectedTopic([...selectedTopic, topicId]);
    }
  };

  const submitTopic = () => {
    if (selectedTopic !== null) {
      const listTopic = {
        parentTopicIdList: selectedTopic,
      };
      axios
        .post(`${API_KEY}/user-topic/${accountSignup?.id}/create`, listTopic, {
          headers: { Authorization: `Bearer ${accountSignup?.access_token}` },
        })
        .then(() => {
          ToastSuccess('Let started enjoy');
          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Dialog open={open} className="select_topic_dialog" TransitionComponent={Transition}>
      <DialogTitle className="dialog-title">
        <Typography>Please select the topic you are referring to.</Typography>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ padding: 8 }}>
            {listTopic?.length <= 0 ? (
              <>
                <Typography variant="h4">No topic data</Typography>
              </>
            ) : (
              listTopic?.map((item) => (
                <Typography
                  key={item.id}
                  style={{ marginTop: 8 }}
                  onClick={() => handleSelectTopic(item.id)}
                  className={`${selectedTopic.includes(item.id) && 'selected'}`}
                >
                  {item.topicParentName}
                </Typography>
              ))
            )}
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={select} alt="select" width={300} height={200} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="dialog-action">
        <Button onClick={onClose}>Other Time</Button>
        <Button onClick={submitTopic}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(SelectTopicDialog);
