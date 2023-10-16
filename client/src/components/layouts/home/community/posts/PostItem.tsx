import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PostItem.scss';
import { IPost } from 'src/queries';
import PostDetailDialog from './PostDetailDialog';

interface PostProps {
  posts?: IPost[];
  handleDetailPost: (id: number) => void;
}

const PostItem = (props: PostProps) => {
  const { posts, handleDetailPost } = props;

  const postApproves = posts?.filter((item) => item.approved);

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
                <Button onClick={() => handleDetailPost(item.id)}>More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostItem;
