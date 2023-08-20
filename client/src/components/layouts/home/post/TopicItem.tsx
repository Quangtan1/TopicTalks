import React from 'react';
import { CardContent, Typography, Modal, Box, List, ListItem, ListItemButton } from '@mui/material';
import './PostItem.scss';

interface Props {
  post: string[];
  open: boolean;
  onOpenClose: () => void;
  handleTopicSelect: (topic: string) => void;
}

const TopicItem: React.FC<Props> = ({ post, open, onOpenClose, handleTopicSelect }) => {
  return (
    <>
      {/* TODO: chỗ ni cũng không dùng được css để bỏ display flex @@ */}
      {post?.map((topic: string) => {
        return (
          <CardContent className="card-topic" key={topic} onClick={onOpenClose}>
            <Typography variant="body2" color="textSecondary">
              {topic}
            </Typography>
          </CardContent>
        );
      })}
      <Modal open={open} onClose={onOpenClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Select a Topic</Typography>
          <List>
            {post.map((topic) => (
              <ListItem disablePadding key={topic} onClick={() => handleTopicSelect(topic)}>
                <ListItemButton>
                  <Typography>{topic}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};

export default TopicItem;
