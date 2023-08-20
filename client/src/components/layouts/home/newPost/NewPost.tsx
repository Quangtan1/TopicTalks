import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { AiFillTag } from 'react-icons/ai';
import './NewPost.scss';

interface Props {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  closePostModal?: () => void;
}

const NewPost: React.FC<Props> = ({ open, setOpen, closePostModal }) => {
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <CreateIcon />
      </IconButton>
      <Dialog open={open} onClose={closePostModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className="dialog-title">
          Create a post
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Box className="avatar-container">
            <Avatar className="avatar" />
            <Box marginLeft={2}>
              <Typography variant="subtitle1" className="username">
                Username
              </Typography>
              <Typography variant="body2" className="topic-tag">
                Topic tag
              </Typography>
            </Box>
          </Box>
          <DialogContentText className="post-label">Post a topic you are interested:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="post-content"
            label="Post content"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            className="post-content-input"
          />
          <Box className="actions-container">
            <Button color="primary" className="post-button">
              Post
            </Button>
            <Button startIcon={<EmojiEmotionsIcon />} color="primary" className="emotion-button">
              Emotion
            </Button>
          </Box>
          <Box className="suggested-topics">
            <Typography variant="subtitle2">
              <AiFillTag />
              Hash tag suggestions by AI:
            </Typography>

            {/* List of suggested topics */}
            <Box display="flex" flexWrap="wrap" sx={{ border: '3px solid rgb(135, 44, 228)' }}>
              <Button variant="outlined" size="small" className="suggested-topic">
                AI Suggested Topic 1
              </Button>
              <Button variant="outlined" size="small" className="suggested-topic">
                AI Suggested Topic 2
              </Button>
              {/* Add more suggested topics as needed */}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={closePostModal} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewPost;
