import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import ChatContext from 'src/context/ChatContext';
import { IMessage } from 'src/types';
import './NotificationDialog.scss';
import { IoNotificationsOutline } from 'react-icons/io5';
import { formatTime } from 'src/utils/helper';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}
const NotificationDialog = observer((props: DialogProps) => {
  const { open, onClose } = props;
  const { notification, setNotification } = useContext(ChatContext);

  return (
    <Dialog open={open} onClose={onClose} className="notification_container">
      <DialogTitle className="dialog_title">
        <IoNotificationsOutline /> Notifications
      </DialogTitle>
      <Typography className="title">Earlier</Typography>
      <DialogContent className="dialog_content">
        {notification?.map((item: IMessage, index: number) => (
          <Box key={index} className="notifi_item">
            <Typography>
              You have a notification from <strong>{item?.username}</strong>{' '}
            </Typography>
            <Typography>{formatTime(item.timeAt)}</Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
});

export default NotificationDialog;
