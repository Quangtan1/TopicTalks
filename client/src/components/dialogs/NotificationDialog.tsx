import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import ChatContext from 'src/context/ChatContext';
import { IMessage } from 'src/types';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}
const NotificationDialog = observer((props: DialogProps) => {
  const { open, onClose } = props;
  const { notification, setNotification } = useContext(ChatContext);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Notification</DialogTitle>
      <DialogContent>
        {notification?.map((item: IMessage, index: number) => (
          <Typography key={index}>You have a notification from {item?.username}</Typography>
        ))}
      </DialogContent>
    </Dialog>
  );
});

export default NotificationDialog;
