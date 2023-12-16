import { Box, Grid, Input, InputAdornment, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';
import { TopicChild } from 'src/types/topic.type';
import { createAxios, getDataAPI } from 'src/utils';
import './ListTopicChild.scss';
import { RiLoader2Line } from 'react-icons/ri';
import { Search } from '@mui/icons-material';

const ListTopicChild = observer(() => {
  const { id, name, search } = useParams();
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  const [isLoadTopic, setIsLoadTopic] = useState<boolean>(false);

  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const accountToken = account?.access_token;

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const total = scrollHeight - windowHeight;
    if (scrollTop >= total && total > 0) {
      setPage((prePage) => prePage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setIsLast(true);
      setPage(0);
    };
  }, [id, search]);

  useEffect(() => {
    const searchUrl = `/topic-children/search?tp_name=${search}&is_expired=false&page=${page}&size=6`;
    const topicUrl = `/topic-children?tpid=${id}&&is_expired=false&page=${page}&size=6`;
    if (isLast) {
      setIsLoadTopic(true);
      getDataAPI(`${search ? searchUrl : topicUrl}`, accountToken, axiosJWT)
        .then((res) => {
          const newListTopic = res.data.data.content;
          page === 0 ? setTopicChild(newListTopic) : setTopicChild((prevTopic) => [...prevTopic, ...newListTopic]);
          setIsLoadTopic(false);
          const lengthData = res.data.data.content.length;
          (lengthData === 0 || lengthData < 6) && setIsLast(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, page, search, isLast]);

  const navigateToDetailTopic = (id: number) => {
    navigate(`/topic-detail/${id}`);
  };

  return (
    <Box className="list_topic_container">
      <Box className="title_topic">
        {search ? <Typography>Results search by {`"${search}"`}</Typography> : <Typography>{name} Topics</Typography>}
        <Typography>
          Home {`>`} {name} Topics
        </Typography>
      </Box>
      {topicChild?.length === 0 && (
        <Box className="no_data">
          <Typography>There are no results found</Typography>
        </Box>
      )}
      <Grid container className="container_item" rowSpacing={5}>
        {topicChild?.map((topicChild) => (
          <Grid item md={4} key={topicChild.id} className="grid_item">
            <Box className="card_topic_child" onClick={() => navigateToDetailTopic(topicChild.id)}>
              <img src={topicChild?.image} alt="topic" className="image_topic" />
              <Typography className="topic_child_title">{topicChild.topicChildrenName}</Typography>
              <Typography className="description">
                Lorem ipsum dolor sit amet, con sectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros.
              </Typography>
              <div className="overlay"></div>
            </Box>
          </Grid>
        ))}
        {isLoadTopic && (
          <Box className="load_topic">
            <RiLoader2Line />
          </Box>
        )}
      </Grid>
    </Box>
  );
});

export default ListTopicChild;
