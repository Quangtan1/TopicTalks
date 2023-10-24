import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import ChatContext from 'src/context/ChatContext';
import { IMessage } from 'src/types';
import './NotificationDialog.scss';
import { IoNotificationsOutline } from 'react-icons/io5';
import { formatTime } from 'src/utils/helper';
import accountStore from 'src/store/accountStore';
import { useNavigate } from 'react-router-dom';
import chatStore from 'src/store/chatStore';
import uiStore from 'src/store/uiStore';
import { notifiData } from 'src/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}
const NotificationDialog = observer((props: DialogProps) => {
  const { open, onClose } = props;
  const { notification, setNotification } = useContext(ChatContext);
  const account = accountStore?.account;
  const navigate = useNavigate();

  const notifiGroup = (message: string) => {
    const result = message.split(',')[2].trim() === account.username ? 'You' : message.split(',')[2].trim();
    let notification: any = '';

    notifiData.forEach((item) => {
      if (message.includes(item.title)) {
        const messageA = item.messageA ? `${item.messageA} ` : '';
        const name = item.isName ? <strong>{result} </strong> : '';
        notification = (
          <>
            {messageA}
            {name}
            {item.messageB}
          </>
        );
      }
    });

    return notification;
  };

  const readNotifi = (id) => {
    navigate('/message');
    const newNotifi = notification.filter((item) => item.conversationId !== id);
    setNotification(newNotifi);
    setTimeout(() => {
      const selectChat = chatStore?.chats?.find((item) => item.conversationInfor.id === id);
      if (selectChat !== undefined) {
        chatStore?.setSelectedChat(selectChat);
      }
      onClose();
    }, 400);
  };
  return (
    <Dialog open={open} onClose={onClose} className="notification_container">
      <DialogTitle className="dialog_title">
        <IoNotificationsOutline /> Notifications
      </DialogTitle>
      <Typography className="title">Earlier</Typography>
      <DialogContent className="dialog_content">
        {notification?.map((item: IMessage, index: number) => (
          <Box key={index} className="notifi_item" onClick={() => readNotifi(item.conversationId)}>
            {item.data.message.includes('option_1410#$#') ? (
              <Typography>
                {notifiGroup(item.data.message)} <strong>{item.groupChat ? item.groupChatName : item.username}</strong>
              </Typography>
            ) : (
              <Typography>
                You have a notification from <strong>{item.groupChat ? item.groupChatName : item?.username}</strong>
              </Typography>
            )}

            <Typography>{formatTime(item.timeAt)}</Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
});

export default NotificationDialog;
