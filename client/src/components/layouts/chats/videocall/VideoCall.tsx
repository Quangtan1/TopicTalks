import React from 'react';
import './VideoCall.scss';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface DialogProps {
  open: boolean;
  onLeaveCall: () => void;
}

const VideoCall = (props: DialogProps) => {
  const { open } = props;
  return (
    <Dialog open={open} className="video_call_container">
      <DialogTitle className="dialog-title">
        <Typography>Please select the topic you are referring to.</Typography>
      </DialogTitle>
      <DialogContent className="dialog-content"></DialogContent>
      <DialogActions className="dialog-action">
        <Button>Other Time</Button>
        <Button>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoCall;
