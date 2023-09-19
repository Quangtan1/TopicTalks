import React from 'react';
import './CreateTopicDialog.scss';
import { Dialog, DialogContent, DialogTitle, Input, Typography } from '@mui/material';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateTopicDialog = (props: DialogProps) => {
  const { open, onClose } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Topic</DialogTitle>
      <DialogContent>
        <Typography>The Primary Topic:</Typography>
        <Input />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicDialog;
