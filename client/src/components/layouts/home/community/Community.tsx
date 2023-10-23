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

const HomePage = observer(() => {
  const [openPostDetail, setOpenPostDetail] = useState<boolean>(false);
  const [postId, setPostId] = useState<number>();
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);

  const posts = postItemStore?.posts;
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`post/all-posts/is-approved=${true}`, account.access_token, axiosJWT)
      .then((res) => {
        postItemStore?.setPosts(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDetailPost = (id: number) => {
    setOpenPostDetail(true);
    setPostId(id);
  };
  return (
    <Box className="community_container">
      <Box className="option_box">
        <Select value={0} className="select">
          <MenuItem value={0} key={0}>
            All Posts
          </MenuItem>
          <MenuItem value={1} key={1}>
            Friend Posts
          </MenuItem>
        </Select>
        <IoAddCircleSharp className="create" onClick={() => setOpenCreatePost(true)} />
      </Box>
      <Box className="title_box">
        <Typography className="title_backgroud">Post</Typography>
        <Typography className="title_group">
          <strong>All</strong> Posts
        </Typography>
      </Box>
      <PostItem posts={posts} handleDetailPost={handleDetailPost} />
      {openPostDetail && (
        <PostDetailDialog open={openPostDetail} onClose={() => setOpenPostDetail(false)} postId={postId} />
      )}
      {openCreatePost && <NewPost open={openCreatePost} closePostModal={() => setOpenCreatePost(false)} />}
    </Box>
  );
});

export default HomePage;
