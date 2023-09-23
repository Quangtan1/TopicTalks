import React from 'react';
import { CardContent, Typography, Modal, Box, List, ListItem, ListItemButton } from '@mui/material';
import './TopicItem.scss';

interface Props {
  key: number;
  post: string[];
  open: boolean;
  onOpenClose: () => void;
  handleTopicSelect: (topic: string) => void;
}

const TopicItem: React.FC<Props> = ({ key, post, open, onOpenClose, handleTopicSelect }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {post?.map((topic: string, index: number) => {
        return (
          <CardContent className="card-topic" key={index} onClick={onOpenClose}>
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
          <List className="list-topic">
            {post.map((topic, index) => (
              <ListItem
                disablePadding
                key={index}
                className="item-of-list-topic"
                onClick={() => handleTopicSelect(topic)}
              >
                <ListItemButton>
                  <Typography>{topic}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </Box>
  );
};

export default TopicItem;
