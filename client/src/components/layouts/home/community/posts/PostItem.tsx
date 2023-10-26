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

interface PostProps {
  posts?: IPost[];
  handleDetailPost: (id: number) => void;
}

const PostItem = observer((props: PostProps) => {
  const { posts, handleDetailPost } = props;

  const postApproves = posts?.filter((item) => {
    const isFriend = friendStore?.friends.some(
      (friend) => (friend.friendId === item?.author_id || friend.userid === item?.author_id) && friend.accept,
    );
    return item.status === 1 || (item.status === 2 && isFriend) || accountStore?.account.id === item.author_id;
  });

  return (
    <Box className="postitem_container">
      <Grid className="post_container" container spacing={4}>
        {postApproves?.map((item) => (
          <Grid md={4} xs={12} item key={item.id}>
            <Card className="card_post">
              <CardMedia image={item.img_url} className="image" />
              <CardContent className="card_content">
                <Typography>{item.title}</Typography>
                <Typography>{item.content}</Typography>
              </CardContent>
              <CardActions className="card_action">
                <span className="item">
                  {item.like.totalLike} <AiOutlineHeart />
                </span>

                <Button onClick={() => handleDetailPost(item.id)}>More</Button>
                <span className="item">
                  {item.totalComment} <FaRegComment />
                </span>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default PostItem;
