import { Box, MenuItem, Select, Typography } from '@mui/material';
import './Community.scss';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';
import PostItem from './posts/PostItem';
import PostDetailDialog from './posts/PostDetailDialog';
import { IoAddCircleSharp } from 'react-icons/io5';
import NewPost from '../../postManagement/newPost/NewPost';
import postItemStore from 'src/store/postStore';
import { ListTopic } from 'src/types/topic.type';
import { RiLoader2Line } from 'react-icons/ri';

const Community = observer(() => {
  const [openPostDetail, setOpenPostDetail] = useState<boolean>(false);
  const [postId, setPostId] = useState<number>();
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const [selectTopic, setSelectTopic] = useState<number>(0);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  const [isLoadPost, setIsLoadPost] = useState<boolean>(false);

  const posts = postItemStore?.posts;
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

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

  const fectchAPI = (pageValue: number) => {
    return getDataAPI(
      `${
        selectTopic === 0
          ? `post/all-posts/is-approved=${true}?page=${pageValue}&size=5`
          : `/post/all-posts/tpid=${selectTopic}?page=${pageValue}&size=5`
      }`,
      account.access_token,
      axiosJWT,
    );
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    getDataAPI(`/topic-parent/all-tparent?isDisable=false`, account.access_token, axiosJWT)
      .then((res) => {
        if (res.data.data !== 'Not exist any children topic.') {
          setListTopic(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        uiStore?.setLoading(false);
      });
    return () => {
      postItemStore?.setPosts([]);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    uiStore?.setLoading(true);
    fectchAPI(0)
      .then((res) => {
        postItemStore?.setPosts(res.data.data.content);
        setPage(0);
        setIsLast(true);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        uiStore?.setLoading(false);
      });
  }, [selectTopic]);

  useEffect(() => {
    if (page !== 0 && isLast) {
      setIsLoadPost(true);
      fectchAPI(page)
        .then((res) => {
          const newPosts = res.data.data.content;
          postItemStore?.setPosts([...postItemStore?.posts, ...newPosts]);
          const lengthData = res.data.data.content.length;
          (lengthData === 0 || lengthData < 5) && setIsLast(false);
          setIsLoadPost(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoadPost(false);
        });
    }
  }, [page]);

  const handleDetailPost = (id: number) => {
    setOpenPostDetail(true);
    setPostId(id);
  };
  return (
    <Box className="community_container">
      <Box className="title_topic">
        <Typography>Explore the beauty of the world</Typography>
        <Typography>
          List of posts {'>'}
          {selectTopic !== 0 ? listTopic?.find((item) => item.id === selectTopic).topicParentName : 'All'}
        </Typography>
      </Box>
      <Box className="option_box">
        <Box className="filter">
          <Typography>Filter:</Typography>
          {selectTopic !== null && (
            <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)} className="select">
              <MenuItem value={0}>All</MenuItem>
              {listTopic.length > 0 &&
                listTopic?.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.topicParentName}
                  </MenuItem>
                ))}
            </Select>
          )}
        </Box>
        <Typography onClick={() => setOpenCreatePost(true)} className="create">
          Create Post <IoAddCircleSharp />
        </Typography>
      </Box>

      <PostItem posts={posts} handleDetailPost={handleDetailPost} />
      {isLoadPost && (
        <Box className="load_post">
          <RiLoader2Line />
        </Box>
      )}
      {openPostDetail && (
        <PostDetailDialog open={openPostDetail} onClose={() => setOpenPostDetail(false)} postId={postId} />
      )}
      {openCreatePost && <NewPost open={openCreatePost} closePostModal={() => setOpenCreatePost(false)} />}
    </Box>
  );
});

export default Community;
