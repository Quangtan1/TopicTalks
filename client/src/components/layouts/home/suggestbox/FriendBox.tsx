import React from 'react';
import { Box, List, ListItem, Avatar, Typography } from '@mui/material';
import { IoAddSharp, IoCloseOutline } from 'react-icons/io5';

const listFriend = [
  {
    userName: 'Tom Hollan',
    avatar: 'https://res.cloudinary.com/tantqdev/image/upload/v1685694100/SocialMedia/v16i5f2dogqp5iywvvfg.jpg',
    topic: ['Social', 'Healthy and Balancce'],
  },
  {
    userName: 'Taylor Switch',
    avatar: 'https://res.cloudinary.com/tantqdev/image/upload/v1685693763/SocialMedia/ypwxwymgo5cb8jraq4xl.jpg',
    topic: ['Math', 'Gym'],
  },
  {
    userName: 'Harry Potter',
    avatar: 'https://res.cloudinary.com/tantqdev/image/upload/v1685694066/SocialMedia/zukashg7miw8xq6bbvxu.jpg',
    topic: ['History', 'Game'],
  },
  {
    userName: 'Luci William',
    avatar: 'https://res.cloudinary.com/tantqdev/image/upload/v1685694112/SocialMedia/b345o6kytzrpghzwiiuy.jpg',
    topic: ['Gym', 'Healthy'],
  },
];

const FriendBox = () => {
  return (
    <Box className="friend-box-container">
      <Typography className="friend-suggest">Suggestion For You</Typography>
      <List>
        {listFriend.map((item, index) => (
          <ListItem key={index} className="friend-list-item">
            <Box className="content-item">
              <Avatar src={item.avatar} />
              <Box>
                <Typography>{item.userName}</Typography>
                <Box className="topic-content">
                  {item.topic.map((topicItem, index) => (
                    <Typography key={index}>{topicItem}</Typography>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box className="friend-action">
              <IoAddSharp />
              <IoCloseOutline />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FriendBox;
