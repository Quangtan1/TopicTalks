import React, { useState } from 'react';
import './SuggestDialog.scss';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { createAxios, getDataAPI, postDataAPI, suggest } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ListTopic, TopicChild } from 'src/types/topic.type';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import { RiLoader2Line } from 'react-icons/ri';
import { AiOutlineClose } from 'react-icons/ai';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  listTopic: ListTopic[];
}

const SuggestDialog = observer((props: DialogProps) => {
  const { open, onClose, listTopic } = props;
  const [selectTopic, setSelectTopic] = useState<number | null>(null);
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const [selected, setSelected] = useState<TopicChild[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  const [isLoadTopic, setIsLoadTopic] = useState<boolean>(false);

  const account = accountStore?.account;

  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const fetchApi = (pageValue: number, topic: number) => {
    return getDataAPI(
      `/topic-children?tpid=${topic}&&is_expired=false&page=${pageValue}&size=8`,
      account.access_token,
      axiosJWT,
    );
  };

  const handleSelectTopicParent = (topic: number) => {
    setIsLoadTopic(true);
    fetchApi(page, topic)
      .then((res) => {
        setSelectTopic(topic);
        setTopicChild(res.data.data.content);
        const lengthData = res.data.data.content.length;
        (lengthData === 0 || lengthData < 8) && setIsLast(false);
        setIsLoadTopic(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickMore = () => {
    if (selectTopic && isLast) {
      setIsLoadTopic(true);
      fetchApi(page + 1, selectTopic)
        .then((res) => {
          const newListTopic = res.data.data.content;
          setPage((prePage) => prePage + 1);
          setTopicChild((prevTopic) => [...prevTopic, ...newListTopic]);
          const lengthData = res.data.data.content.length;
          (lengthData === 0 || lengthData < 8) && setIsLast(false);
          setIsLoadTopic(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleBackTopic = () => {
    setPage(0);
    setSelectTopic(null);
    setIsLast(true);
    setSelected([]);
    setTopicChild([]);
  };

  const handleSelectTopic = (topic: TopicChild) => {
    const isSelected = selected?.some((item) => item.id === topic.id);
    if (isSelected) {
      const newSelectedTopic = selected?.filter((item) => item.id !== topic.id);
      setSelected(newSelectedTopic);
    } else {
      setSelected((preTopic) => [...preTopic, topic]);
    }
  };

  const handleSubmit = () => {
    if (selected?.length > 0) {
      const data = selected?.map((item) => ({
        userId: account?.id,
        tpcId: item?.id,
        rating: 5,
      }));
      postDataAPI(`/ratings/topics`, data, account.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess('Wishing you great experiences with Topictalks!');

          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ToastError('Please choose topic!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="suggest_topic_dialog">
      <DialogContent className="dialog_content">
        <AiOutlineClose onClick={onClose} />
        <img src={suggest} alt="about" className="image" />
        <Box className="box_create">
          <Box className="dialog_title">
            <Typography>Hi {account?.username}</Typography>
            {selectTopic ? (
              <Typography className="title">Select Topic that Interests You</Typography>
            ) : (
              <Typography className="title">Major Topics in Our Surroundings</Typography>
            )}
          </Box>
          <Box className="topic_box">
            {selectTopic
              ? topicChild?.map((item) => (
                  <Typography
                    className={`topic_child_name ${selected?.some((topic) => topic.id === item.id) && 'selected'} `}
                    onClick={() => handleSelectTopic(item)}
                  >
                    {item.topicChildrenName}
                  </Typography>
                ))
              : listTopic?.map((item) => (
                  <Typography className={`topic_parent_name`} onClick={() => handleSelectTopicParent(item.id)}>
                    {item.topicParentName}
                  </Typography>
                ))}
            {isLoadTopic && (
              <Box className="load_topic">
                <RiLoader2Line />
              </Box>
            )}
          </Box>
          {selectTopic && isLast && (
            <Button onClick={handleClickMore} className="more">
              Show More...
            </Button>
          )}
          <Box className="dialog_action">
            {selectTopic && <Button onClick={handleBackTopic}>Back</Button>}
            <Button onClick={handleSubmit}>Submit</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

export default SuggestDialog;
