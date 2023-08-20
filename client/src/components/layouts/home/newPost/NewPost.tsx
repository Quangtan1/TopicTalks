import React from 'react';
import {
  //   Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { AiFillTag } from 'react-icons/ai';
import './NewPost.scss';

interface Props {
  open?: boolean;
  closePostModal?: () => void;
}

const NewPost: React.FC<Props> = ({ open, closePostModal }) => {
  return (
    <>
      <Dialog open={open} onClose={closePostModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className="dialog-title">
          Create a post
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Box className="avatar-container">
            {/* <Avatar className="avatar" /> */}
            <img
              alt="avatar"
              src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.6435-9/133705653_1640137159522663_508931059513204360_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=174925&_nc_ohc=OYdhvQnAJMEAX-B8rzC&_nc_ht=scontent.fsgn2-3.fna&oh=00_AfBAjH_WOu99Q59AEMsqblhOURvXohqlk4eoTUMaNZA6yQ&oe=6509781B"
              width={50}
              height={50}
              className="avatar"
            />
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
              <Button variant="outlined" size="small" className="suggested-topic">
                AI Suggested Topic 3
              </Button>
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
