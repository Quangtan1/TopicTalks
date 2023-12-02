import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
import React, { useState } from 'react';
import './PostPopular.scss';
import { IPost } from 'src/queries';
import { formatDatePost } from 'src/utils/helper';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface IPostProps {
  posts: IPost[];
}
const PostPopular = (props: IPostProps) => {
  const { posts } = props;
  const navigate = useNavigate();

  const navigatedetailPost = (id: number) => {
    navigate(`/post-detail/${id}`);
  };
  const navigateProfile = (id: number) => {
    navigate(`/personal-profile/${id}`);
  };

  return (
    <Box className="post_popular_container">
      <Box className="box_post_item">
        <Box className="box_post">
          <Typography className="title">Posts Popular</Typography>
          <Divider />
          {posts?.map((item) => (
            <Box className="post_item" key={item.id}>
              <img src={item.img_url} alt="img" onClick={() => navigatedetailPost(item.id)} />
              <Box className="content_post">
                <Typography>{item.topicName} .</Typography>
                <Typography onClick={() => navigatedetailPost(item.id)}>
                  {item.title}
                  <FaRegStar />
                </Typography>
                <Typography>
                  {formatDatePost(item.created_at)} / / {item.like.totalLike} LIKES && {item.totalComment} COMMENTS
                </Typography>
              </Box>
            </Box>
          ))}
          <Button className="button_show_more" onClick={() => navigate('/community')}>
            See More <MdKeyboardDoubleArrowRight />
          </Button>
        </Box>
        <Box className="box_comment">
          <Typography className="title">Last Comments</Typography>
          <Divider />
          {posts?.map((item) => (
            <Box className="comment_item" key={item.id}>
              <Avatar
                src={item.lastComment.userImage}
                alt="avt"
                className="avt"
                onClick={() => navigateProfile(item.lastComment.userId)}
              />
              <Box className="box_infor">
                <span>
                  <Typography>{item.lastComment.username}</Typography>
                  <p>.</p>
                  <Typography>{formatDatePost(item.lastComment.createAt)}</Typography>
                </span>
                <Typography className="content">{item.lastComment.content}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PostPopular;
