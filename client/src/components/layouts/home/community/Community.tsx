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

const HomePage = observer(() => {
  const [openPostDetail, setOpenPostDetail] = useState<boolean>(false);
  const [postId, setPostId] = useState<number>();
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const [selectTopic, setSelectTopic] = useState<number>(0);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);

  const posts = postItemStore?.posts;
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    getDataAPI(`/topic-parent/all`, account.access_token, axiosJWT)
      .then((res) => {
        if (res.data.data !== 'Not exist any children topic.') {
          setListTopic(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(
      `${selectTopic === 0 ? `post/all-posts/is-approved=${true}` : `/post/all-posts/tpid=${selectTopic}`}`,
      account.access_token,
      axiosJWT,
    )
      .then((res) => {
        postItemStore?.setPosts(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectTopic]);

  const handleDetailPost = (id: number) => {
    setOpenPostDetail(true);
    setPostId(id);
  };
  return (
    <Box className="community_container">
      <Box className="option_box">
        {selectTopic !== null && (
          <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)} className="select">
            <MenuItem value={0}>All</MenuItem>
            {listTopic.length > 0 &&
              listTopic.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.topicParentName}
                </MenuItem>
              ))}
          </Select>
        )}

        <IoAddCircleSharp className="create" onClick={() => setOpenCreatePost(true)} />
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
