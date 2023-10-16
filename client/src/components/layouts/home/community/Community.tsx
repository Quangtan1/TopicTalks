import { Box, Typography } from '@mui/material';
import './Community.scss';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { IPost } from 'src/queries';
import uiStore from 'src/store/uiStore';
import PostItem from './posts/PostItem';
import PostDetailDialog from './posts/PostDetailDialog';

const HomePage = observer(() => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [openPostDetail, setOpenPostDetail] = useState<boolean>(false);
  const [postId, setPostId] = useState<number>();

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
        setPosts(res.data.data);
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
    </Box>
  );
});

export default HomePage;
