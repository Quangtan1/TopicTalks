import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import './EmotionModal.scss';

interface EmotionModalProps {
  open: boolean;
  onClose: () => void;
  emotion: string;
  setEmotion: (emotion: string) => void;
}

const EmotionModal: React.FC<EmotionModalProps> = ({ open, onClose, emotion, setEmotion }) => {
  // const handleClickEmotion = (index: number) => {
  //   setEmotion(emotionIcons[index]);
  //   onClose();
  // };
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="emotion-dialog-title" className="dialog-title-wrap">
      <DialogTitle id="emotion-dialog-title" className="dialog-title">
        Select Emotion
        <IconButton aria-label="close" onClick={onClose} className="close-button">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Box className="emotion-icons-container">
          {/* {emotionIcons.map((icon, index) => (
            <img
              key={index}
              src={icon}
              alt={`Emotion ${index + 1}`}
              className="emotion-icon"
              onClick={() => handleClickEmotion(index)}
            />
          ))} */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmotionModal;
