import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PostItem.scss';
import { IPost } from 'src/queries';
import PostDetailDialog from './PostDetailDialog';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import friendStore from 'src/store/friendStore';
import accountStore from 'src/store/accountStore';
import { observer } from 'mobx-react';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { RiDoubleQuotesL } from 'react-icons/ri';

interface PostProps {
  posts?: IPost[];
  handleDetailPost: (id: number) => void;
}

const PostItem = observer((props: PostProps) => {
  const { posts, handleDetailPost } = props;

  const postApproves = posts?.filter((item) => {
    const isFriend = friendStore?.friends?.some(
      (friend) => (friend.friendId === item?.author_id || friend.userid === item?.author_id) && friend.accept,
    );
    return (
      item.status === 1 ||
      (item.status === 2 && isFriend) ||
      (accountStore?.account.id === item.author_id && item.status !== 3)
    );
  });

  const formatDate = (date: string) => {
    const dateObj = new Date(date);

    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${months[monthIndex]} ${day} ${year}`;
  };

  const postApprovesSort = postApproves?.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return Math.floor(timeB / 1000) - Math.floor(timeA / 1000);
  });
  return (
    <Box className="postitem_container">
      {postApprovesSort?.map((item, index: number) => (
        <Box className={`card_post ${index % 2 === 0 ? 'image_right' : 'image_left'}`} key={item.id}>
          <img src={item.img_url} className="image" alt="img" />
          <Box className="box_card_content">
            <RiDoubleQuotesL className="quotes" />
            <Typography className="topic_name">{item.topicName},</Typography>
            <Typography className="title">{item.title}</Typography>
            <Typography className="date">
              {formatDate(item.created_at)} / / {item.like.totalLike} LIKES && {item.totalComment} COMMENTS
            </Typography>
            <span>_________</span>
            <Typography className="content">{item.content}</Typography>
            <Button onClick={() => handleDetailPost(item.id)}>
              Read More <HiOutlineArrowRight />
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
});

export default PostItem;
