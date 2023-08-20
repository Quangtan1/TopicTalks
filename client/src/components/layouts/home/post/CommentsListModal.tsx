import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import { IComment } from './PostItem';

interface Props {
  comments: IComment[];
}

const CommentsList: React.FC<Props> = ({ comments }) => {
  return (
    <List>
      {comments.map((comment) => (
        <ListItem key={comment.id}>
          <ListItemAvatar>
            <Avatar>{comment.user[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={comment.user} secondary={<Typography variant="body2">{comment.text}</Typography>} />
        </ListItem>
      ))}
    </List>
  );
};

export default CommentsList;
