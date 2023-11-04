import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import ChatContext from 'src/context/ChatContext';
import { IMessage, INotifiSystem } from 'src/types';
import './NotificationDialog.scss';
import { IoNotificationsOutline } from 'react-icons/io5';
import { formatTime } from 'src/utils/helper';
import accountStore from 'src/store/accountStore';
import { useNavigate } from 'react-router-dom';
import chatStore from 'src/store/chatStore';
import uiStore from 'src/store/uiStore';
import { createAxios, deleteDataAPI, imageGroup, notifiData, postDataAPI, putDataAPI } from 'src/utils';
import friendStore from 'src/store/friendStore';
import { ToastSuccess } from 'src/utils/toastOptions';
import DialogCommon from './DialogCommon';
import { TbCircleDotFilled } from 'react-icons/tb';
import { FiberManualRecord } from '@mui/icons-material';
import { FaEnvelopeOpen, FaEnvelopeOpenText } from 'react-icons/fa';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}
const NotificationDialog = observer((props: DialogProps) => {
  const { open, onClose } = props;
  const { notifiSystem, setNotifiSystem } = useContext(ChatContext);
  const [tab, setTab] = useState<number>(1);
  const [openConfirm, setOpenConFirm] = useState<boolean>(false);
  const [friendIdCustom, setFriendIdCustom] = useState<number>();
  const [friendNameCustom, setFriendNameCustom] = useState<string>('');
  const [listFriendIdCustom, setListFriendIdCustom] = useState<number>();
  const account = accountStore?.account;
  const navigate = useNavigate();

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

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
    const newNotifi = notifiSystem.filter((item) => item.conversationId !== id);
    setNotifiSystem(newNotifi);
    setTimeout(() => {
      const selectChat = chatStore?.chats?.find((item) => item.conversationInfor.id === id);
      if (selectChat !== undefined) {
        chatStore?.setSelectedChat(selectChat);
      }
      onClose();
    }, 400);
  };
  const acceptFriend = (friendId: number, friendName: string, friendListId: number) => {
    const dataRequest = {
      userId: friendId,
      friendId: account.id,
    };
    postDataAPI(`/friends/acceptFriendsApply`, dataRequest, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess(`You and ${friendName} are friends now`);
        const newListFriends = friendStore?.friends.filter((item) => item.friendListId !== res.data.data.friendListId);
        friendStore?.setFriends([...newListFriends, res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteFriend = (fId: number, friendName: string, friendListId: number) => {
    const friendListCustom = friendStore?.friends.find(
      (item) =>
        (item.friendId === account.id || item.userid === account.id) && (item.friendId === fId || item.userid === fId),
    );
    const userId = friendListCustom.userid;
    const friendId = friendListCustom.friendId;

    deleteDataAPI(`/friends/rejectFriendsApply?uid=${userId}&fid=${friendId}`, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess(`You have just rejected request of ${friendName}`);
        const newListFriends = friendStore?.friends.filter((item) => item?.friendListId !== friendListId);
        friendStore?.setFriends(newListFriends);
        setOpenConFirm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateReadNotifi = (notifiId) => {
    putDataAPI(`/notification/${notifiId}`, null, account.access_token, axiosJWT)
      .then((res) => {
        // const index = notifiSystem?.findIndex((item) => item.notiId === notifiId);
        // if (index !== -1) {
        //   const updatedNotifications = [...notifiSystem];
        //   updatedNotifications[index] = {
        //     ...updatedNotifications[index],
        //     isRead: true,
        //   };
        //   setNotifiSystem(updatedNotifications);
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const readPostDetail = (id: number) => {
    navigate(`/post-detail/${id}`);
    onClose();
  };

  const handleConfirm = (fId: number, friendName: string, friendListId: number) => {
    setFriendIdCustom(fId);
    setFriendNameCustom(friendName);
    setListFriendIdCustom(friendListId);
    setOpenConFirm(true);
  };

  const notifiSort = notifiSystem?.sort((a, b) => {
    const timeA = new Date(a.createAt).getTime();
    const timeB = new Date(b.createAt).getTime();
    return Math.floor(timeB / 1000) - Math.floor(timeA / 1000);
  });

  const content = `Do you want to reject request of ${friendNameCustom}`;
  const listRequest = friendStore?.friends?.filter((item) => !item.accept && account.id === item.friendId);

  const isNew = notifiSort?.length === 0 && tab === 1;
  const isRequest = (listRequest?.length === 0 || listRequest === undefined) && tab === 2;

  return (
    <Dialog open={open} onClose={onClose} className="notification_container">
      <DialogTitle className="dialog_title">
        <IoNotificationsOutline /> Notifications
      </DialogTitle>
      <Box className="tab_notifi">
        <Typography className={`${tab === 1 && 'active_tab'} title`} onClick={() => setTab(1)}>
          New
        </Typography>
        <Typography className={`${tab === 2 && 'active_tab'} title`} onClick={() => setTab(2)}>
          Request
        </Typography>
      </Box>
      <DialogContent className={`${(isNew || isRequest) && 'no_data'} dialog_content`}>
        {isNew || isRequest ? (
          <Box className="box_no_data">
            <span>
              <FaEnvelopeOpen />
            </span>
            <Typography>There is no data</Typography>
          </Box>
        ) : tab === 1 ? (
          notifiSort &&
          notifiSort?.map((item: INotifiSystem) => (
            <Box
              key={item.notiId}
              className="notifi_item"
              onClick={() => {
                item.conversationId ? readNotifi(item.conversationId) : readPostDetail(item.postId);
                updateReadNotifi(item.notiId);
              }}
            >
              {item.message.includes('option_1410#$#') ? (
                <Box className="group_notifi">
                  <img src={item.groupImage || imageGroup} alt="img" />
                  <span>
                    <Typography>
                      {notifiGroup(item.message)} <strong>{item.isGroupChat ? item.chatName : item.username}</strong>
                    </Typography>

                    <Typography className="time">{formatTime(item.createAt)}</Typography>
                  </span>
                  {!item.isRead && <FiberManualRecord className="isread_notifi" />}
                </Box>
              ) : (
                <Box className="notifi_post">
                  <img src={item.postImage} alt="post" />
                  <span>
                    <Typography className="content">{item.message}</Typography>
                    <Typography className="time">{formatTime(item.createAt)}</Typography>
                  </span>
                  {!item.isRead && <FiberManualRecord className="isread_notifi" />}
                </Box>
              )}
            </Box>
          ))
        ) : (
          listRequest?.map((item) => (
            <Box className="notifi_request" key={item.friendListId}>
              <Avatar src={item.userUrl} alt="img" className="avatar" />
              <span>
                <Typography className="content">
                  <strong>{item.userName}</strong> sent you a friend request
                </Typography>
                <Box className="option_action">
                  <Button
                    className="accept"
                    onClick={() =>
                      acceptFriend(
                        item.userid === account.id ? item.friendId : item.userid,
                        item.userid === account.id ? item.friendName : item.userName,
                        item.friendListId,
                      )
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    className="cancel_request"
                    onClick={() =>
                      handleConfirm(
                        item.userid === account.id ? item.friendId : item.userid,
                        item.userid === account.id ? item.friendName : item.userName,
                        item.friendListId,
                      )
                    }
                  >
                    Delete
                  </Button>
                </Box>
                <Typography className="time">{formatTime(item.createdAt)}</Typography>
              </span>
            </Box>
          ))
        )}
      </DialogContent>
      {openConfirm && (
        <DialogCommon
          open={openConfirm}
          onClose={() => setOpenConFirm(false)}
          onConfirm={() => deleteFriend(friendIdCustom, friendNameCustom, listFriendIdCustom)}
          content={content}
        />
      )}
    </Dialog>
  );
});

export default NotificationDialog;
