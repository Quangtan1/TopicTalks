import { Box, Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { IPost } from 'src/queries';
import accountStore from 'src/store/accountStore';
import { createAxios, getDataAPI } from 'src/utils';
import './PostDetail.scss';
import { formatDatePost, formatTime } from 'src/utils/helper';
import uiStore from 'src/store/uiStore';
import { useNavigate, useParams } from 'react-router-dom';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { HiOutlineArrowRight } from 'react-icons/hi';
import PostDetailDialog from './PostDetailDialog';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { handleTitle } from 'src/components/layouts/profile/PartnerProfile';
import { handleGetOnlyTitle } from 'src/components/admin/managepost/ManagePost';

const PostDetail = observer(() => {
  const { id } = useParams();
  const postId = id;
  const [post, setPost] = useState<IPost>(null);

  const [openPostDetail, setOpenPostDetail] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleNavigateToFriendPage = (friendId: number) => {
    navigate(`/personal-profile/${friendId}`);
  };

  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`/post/${postId}`, account.access_token, axiosJWT)
      .then((res) => {
        uiStore?.setLoading(false);
        setPost(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <Box className="postdetail_container">
      <Box className="title_topic">
        <Typography>Explore the beauty of the world</Typography>
        <Typography>
          Post Detail {'>'} {handleGetOnlyTitle(post?.title)}
        </Typography>
      </Box>
      <Box className={`card_post image_right }`}>
        <img src={post?.img_url} className="image" alt="img" loading="eager" />
        <Box className="box_card_content">
          <RiDoubleQuotesL className="quotes" />
          <Typography className="topic_name">{post?.topicName},</Typography>
          <Typography className="title">{handleTitle(post?.title, handleNavigateToFriendPage)}</Typography>
          <Typography className="date">
            {formatDatePost(post?.created_at)} / / {post?.like.totalLike} LIKES && {post?.totalComment} COMMENTS
          </Typography>
          <span>_________</span>
          {post?.rejected && (
            <Typography className="reject">
              <MdOutlineErrorOutline />
              {post?.reasonRejected}
            </Typography>
          )}
          <Typography className="content">{post?.content}</Typography>
          <Button onClick={() => setOpenPostDetail(true)}>
            Read More <HiOutlineArrowRight />
          </Button>
        </Box>
      </Box>
      {openPostDetail && (
        <PostDetailDialog open={openPostDetail} onClose={() => setOpenPostDetail(false)} postId={post?.id} />
      )}
    </Box>
  );
});

export default PostDetail;
