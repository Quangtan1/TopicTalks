import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import './Rating.scss';
import { GiRoundStar } from 'react-icons/gi';
import { ToastSuccess } from 'src/utils/toastOptions';

interface IDialogProps {
  open: boolean;
  onClose: () => void;
}
const Rating = (props: IDialogProps) => {
  const { open, onClose } = props;
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleStarHover = (value: number) => {
    setHoverValue(value);
  };

  const handleStarClick = (value: number) => {
    console.log(value);
    ToastSuccess('Rating Successfully');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="rating_container">
      <DialogTitle className="dialog_title">Rating</DialogTitle>
      <DialogContent className="dialog_content">
        {[1, 2, 3, 4, 5].map((value) => (
          <GiRoundStar
            key={value}
            className={`star ${value <= (hoverValue || 0) ? 'hovered' : ''}`}
            onMouseEnter={() => handleStarHover(value)}
            onMouseLeave={() => handleStarHover(null)}
            onClick={() => handleStarClick(value)}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default Rating;
