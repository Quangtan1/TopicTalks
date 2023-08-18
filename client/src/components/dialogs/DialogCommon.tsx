import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
} from '@mui/material';
import React from 'react';
import './DialogCommon.scss';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { CiWarning } from 'react-icons/ci';

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const DialogCommon = ({ open, content, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} className="dialog-common">
      <DialogTitle className="dialog-title">
        <CiWarning />
        <Typography>Warning</Typography>
        <IconButton aria-label="close" onClick={onClose} className="close-icon">
          <IoCloseCircleOutline />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">{content}</DialogContent>
      <DialogActions className="dialog-action">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCommon;
