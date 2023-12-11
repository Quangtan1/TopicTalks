import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from '@mui/material';
import React, { useEffect, useState, memo } from 'react';
import './SelectTopicChildrenDialog.scss';
import axios from 'axios';
import { IUser } from 'src/types/account.types';
import { API_KEY } from 'src/utils';
import { ToastSuccess } from 'src/utils/toastOptions';
import select from 'src/assets/images/select.svg';
import { TopicChild } from 'src/types/topic.type';
import Loading from 'src/components/loading/Loading';

interface DialogProps {
  open: boolean;
  accountSignup: IUser;
  onClose: () => void;
  topicParentId: number;
  selectedTopicChild: number[];
  setSelectedTopicChild: (selectedTopicChild: number[]) => void;
}

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const SelectTopicCustomDialog = (props: DialogProps) => {
  const { open, accountSignup, onClose, topicParentId, setSelectedTopicChild, selectedTopicChild } = props;
  const [listTopicChildren, setListTopicChildren] = useState<TopicChild[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_KEY}/topic-children?tpid=${topicParentId}&is_expired=true&page=${page}&size=10`, {
        headers: { Authorization: `Bearer ${accountSignup?.access_token}` },
      })
      .then((res) => {
        if (res.data.data !== 'Not exist any children topic.') {
          setListTopicChildren(res.data.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountSignup, page]);

  const handleSelectTopic = (topicId: number) => {
    if (selectedTopicChild.includes(topicId)) {
      const newSelectedTopic = selectedTopicChild.filter((itemId) => itemId !== topicId);
      setSelectedTopicChild(newSelectedTopic);
    } else {
      setSelectedTopicChild([...selectedTopicChild, topicId]);
    }
  };

  const submitTopic = () => {
    if (selectedTopicChild !== null) {
      const listTopic = {
        childrenTopicIdList: selectedTopicChild,
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
    <Dialog open={open} className="select_topic_favour_dialog" TransitionComponent={Transition}>
      <DialogTitle className="dialog-title">
        <Typography>Please select the topic you are interesting:</Typography>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Box sx={{ display: 'flex' }}>
          {isLoading ? (
            <Loading />
          ) : (
            listTopicChildren?.length > 0 &&
            selectedTopicChild && (
              <Box sx={{ padding: 8 }}>
                {listTopicChildren?.length <= 0 ? (
                  <>
                    <Typography variant="h4">No topic data</Typography>
                  </>
                ) : (
                  listTopicChildren?.map((item) => (
                    <Typography
                      key={item.id}
                      style={{ marginTop: 8 }}
                      onClick={() => handleSelectTopic(item.id)}
                      className={`${selectedTopicChild.includes(item.id) && 'selected'}`}
                    >
                      {item.topicChildrenName}
                    </Typography>
                  ))
                )}
              </Box>
            )
          )}
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

export default memo(SelectTopicCustomDialog);
