import React, { useState } from 'react';
import {
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
import EmotionModal from './emotionModal/EmotionModal';

interface Props {
  open?: boolean;
  closePostModal?: () => void;
}

const NewPost: React.FC<Props> = ({ open, closePostModal }) => {
  const [inputContent, setInputContent] = useState('');
  const [suggestedTopic, setSuggestedTopic] = useState([]);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [emotion, setEmotion] = useState('');

  const openEmotionModal = () => {
    setIsEmotionModalOpen(true);
    setInputContent('');
  };

  const closeEmotionModal = () => {
    setIsEmotionModalOpen(false);
  };

  const handleClickRemoveEmotion = () => {
    setEmotion('');
  };

  return (
    <>
      <Dialog open={open} onClose={closePostModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className="dialog-title">
          Create a post
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Box className="avatar-container">
            <img
              alt="avatar"
              src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.6435-9/133705653_1640137159522663_508931059513204360_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=174925&_nc_ohc=OYdhvQnAJMEAX-B8rzC&_nc_ht=scontent.fsgn2-3.fna&oh=00_AfBAjH_WOu99Q59AEMsqblhOURvXohqlk4eoTUMaNZA6yQ&oe=6509781B"
              width={50}
              height={50}
              className="avatar"
            />
            <Box marginLeft={2}>
              <Typography variant="subtitle1" className="username">
                Le V. Son
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
            onChange={(e) => setInputContent(e.target.value)}
            rows={4}
            value={inputContent}
            multiline
            variant="outlined"
            className="post-content-input"
          />
          {!!emotion && (
            <Box display={'flex'} alignItems={'center'} className="wrap-emotion">
              <Typography variant="body2" className="emotion-text">
                Feeling:
              </Typography>
              <img
                src={emotion}
                alt={`Emotion ${emotion.toString()}}`}
                className="emotion-icon"
                onClick={() => handleClickRemoveEmotion()}
              />
            </Box>
          )}
          <Box className="actions-container">
            <Button className="post-button">Post</Button>
            <Button startIcon={<EmojiEmotionsIcon />} className="emotion-button" onClick={openEmotionModal}>
              Emotion
            </Button>
            <EmotionModal
              open={isEmotionModalOpen}
              onClose={closeEmotionModal}
              emotion={emotion}
              setEmotion={setEmotion}
            />
          </Box>
          <Box className="suggested-topics">
            <Typography variant="subtitle2">
              <AiFillTag />
              Hash tag suggestions by AI:
            </Typography>

            {/*  of suggested topics */}
            <Box display="flex" flexWrap="wrap" sx={{ border: '3px solid rgb(135, 44, 228)' }}>
              <Button variant="outlined" size="small" className="suggested-topic">
                AI Suggested Topic 1
              </Button>
              <Button variant="outlined" size="small" className="suggested-topic">
                AI Suggested Topic 2
              </Button>
              <Button variant="outlined" size="small" className="suggested-topic">
                {suggestedTopic}
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
