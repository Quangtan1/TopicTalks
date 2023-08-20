import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  emotion1,
  emotion2,
  emotion3,
  emotion4,
  emotion5,
  emotion6,
  emotion7,
  emotion8,
  emotion9,
  emotion10,
  emotion11,
  emotion12,
  emotion13,
  emotion14,
} from 'src/utils/consts';
import './EmotionModal.scss';

interface EmotionModalProps {
  open: boolean;
  onClose: () => void;
  emotionList: string[];
  setEmotionList: (emotionList: string[]) => void;
}

const EmotionModal: React.FC<EmotionModalProps> = ({ open, onClose, emotionList, setEmotionList }) => {
  const emotionIcons = [
    emotion1,
    emotion2,
    emotion3,
    emotion4,
    emotion5,
    emotion6,
    emotion7,
    emotion8,
    emotion9,
    emotion10,
    emotion11,
    emotion12,
    emotion13,
    emotion14,
  ];

  const handleClickEmotion = (index: number) => {
    setEmotionList([...emotionList, emotionIcons[index]]);
  };
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
          {emotionIcons.map((icon, index) => (
            <img
              key={index}
              src={icon}
              alt={`Emotion ${index + 1}`}
              className="emotion-icon"
              onClick={() => handleClickEmotion(index)}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmotionModal;
