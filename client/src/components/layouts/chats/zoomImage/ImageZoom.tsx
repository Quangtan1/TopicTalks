import { Dialog } from '@mui/material';
import React from 'react';
import './ImageZoom.scss';

interface IDialogProps {
  open: boolean;
  onClose: () => void;
  image: string;
}
const ImageZoom = (props: IDialogProps) => {
  const { open, onClose, image } = props;
  return (
    <Dialog open={open} onClose={onClose} className="image_zoom_container">
      <img src={image} alt="img" loading="lazy" />
    </Dialog>
  );
};

export default ImageZoom;
