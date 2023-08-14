import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import './PostItem.scss';

const fakeDataPost = [
  {
    id: 2,
    userName: 'Dakanai',
    content: 'Have a nice day',
    topic: 'Life',
    status: 'Đang cảm thấy hứng thú',
    image: ['https://res.cloudinary.com/tantqdev/image/upload/v1689988785/SocialMedia/pxrgpphfim6pq1usglt1.jpg'],
  },
  {
    id: 3,
    userName: 'Dakanai',
    content: 'Have a nice day',
    topic: 'Life',
    status: 'Đang cảm thấy hứng thú',
    image: ['https://res.cloudinary.com/tantqdev/image/upload/v1689988785/SocialMedia/pxrgpphfim6pq1usglt1.jpg'],
  },
  {
    id: 1,
    userName: 'Dakanai',
    content: 'Have a nice day',
    topic: 'Life',
    status: 'Đang cảm thấy hứng thú',
    image: ['https://res.cloudinary.com/tantqdev/image/upload/v1690612221/SocialMedia/amy81ve0jx2xaap79snj.jpg'],
  },
];

const PostItem = () => {
  return (
    <Box className="post-item-container">
      {fakeDataPost.map((post) => (
        <Card className="card-item" key={post.id}>
          <CardHeader
            avatar={<Avatar />}
            title={post.userName}
            subheader={
              <Typography variant="body2" color="rgb(160, 154, 154)">
                {post?.status}
              </Typography>
            }
            action={<HiDotsHorizontal />}
          />
          <CardContent>
            <Typography>{post.content}</Typography>
          </CardContent>
          <CardMedia component="img" image={post.image[0]} title={post.userName} />
        </Card>
      ))}
    </Box>
  );
};

export default PostItem;
