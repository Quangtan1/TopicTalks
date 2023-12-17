import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useState, useRef, useEffect, useContext } from 'react';
import './AvatarGroup.scss';
import { IUserProfile } from 'src/types/account.types';
import { IoImagesOutline } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/ai';
import { handleImageUpload } from 'src/utils/helper';
import uiStore from 'src/store/uiStore';
import { observer } from 'mobx-react';
import { createAxios, postDataAPI, putDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ToastSuccess } from 'src/utils/toastOptions';
import chatStore from 'src/store/chatStore';
import { ListMesage } from 'src/types/chat.type';
import ChatContext from 'src/context/ChatContext';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  chat: ListMesage;
}
const AvatarGroup = observer((props: DialogProps) => {
  const { open, onClose, chat } = props;
  const [imageFile, setImageFile] = useState<string>('');
  const imageRef = useRef(null);
  const optionCode = 'option_1410#$#';

  const { socket, setMessage } = useContext(ChatContext);

  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    if (imageFile === 'err') {
      uiStore?.setLoading(false);
      setImageFile('');
    } else {
      uiStore?.setLoading(false);
    }
  }, [imageFile]);

  const handleLinkClick = () => {
    imageRef.current.click();
  };

  const updateAvatar = () => {
    const data = {
      avatarImg: imageFile,
      userIdUpdate: account?.id,
    };

    const receiveMessageDTO = {
      data: {
        message: `${optionCode},UpdateImage, ${chat?.conversationInfor.chatName}`,
      },
      TargetId: chat?.partnerDTO[0]?.id,
      userId: account.id,
      conversationId: chat?.conversationInfor.id,
      groupChatName: chat?.conversationInfor.isGroupChat ? chat?.conversationInfor.chatName : null,
      groupChat: chat?.conversationInfor.isGroupChat,
    };
    const lastMessage = {
      senderId: account.id,
      userName: account.username,
      message: receiveMessageDTO.data.message,
      timeAt: new Date().toISOString(),
    };
    chatStore?.updateLastMessage(chat?.conversationInfor.id, lastMessage);
    socket.emit('sendMessage', receiveMessageDTO);
    setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
    putDataAPI(`/conversation/update-avt/${chat?.conversationInfor.id}`, data, account.access_token, axiosJWT)
      .then(() => {
        ToastSuccess('Update Avatar Group Successfully');
        chatStore?.setSelectedChat({
          ...chat,
          conversationInfor: {
            ...chat?.conversationInfor,
            avtGroupImg: imageFile,
          },
        });
        chatStore?.updateChat(chat?.conversationInfor.id, chat?.conversationInfor.chatName, imageFile);
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAvatar = () => {
    const data = {
      avatarImg: '',
      userIdUpdate: account?.id,
    };

    const receiveMessageDTO = {
      data: {
        message: `${optionCode},UpdateImage, ${chat?.conversationInfor.chatName}`,
      },
      TargetId: chat?.partnerDTO[0]?.id,
      userId: account.id,
      conversationId: chat?.conversationInfor.id,
      groupChatName: chat?.conversationInfor.isGroupChat ? chat?.conversationInfor.chatName : null,
      groupChat: chat?.conversationInfor.isGroupChat,
    };
    const lastMessage = {
      senderId: account.id,
      userName: account.username,
      message: receiveMessageDTO.data.message,
      timeAt: new Date().toISOString(),
    };
    chatStore?.updateLastMessage(chat?.conversationInfor.id, lastMessage);
    socket.emit('sendMessage', receiveMessageDTO);
    setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
    putDataAPI(`/conversation/update-avt/${chat?.conversationInfor.id}`, data, account.access_token, axiosJWT)
      .then(() => {
        ToastSuccess('Delete Avatar Group Successfully');
        chatStore?.setSelectedChat({
          ...chat,
          conversationInfor: {
            ...chat?.conversationInfor,
            avtGroupImg: '',
          },
        });
        chatStore?.updateChat(chat?.conversationInfor.id, chat?.conversationInfor.chatName, '');
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Dialog open={open} onClose={onClose} className="avatar_group_dialog">
      <DialogTitle className="dialog_title">
        Update Avatar Group <AiOutlineClose onClick={onClose} />
      </DialogTitle>
      <DialogContent className="dialog_content">
        {imageFile !== '' ? <img src={imageFile} alt="avatar" loading="lazy" /> : <IoImagesOutline />}

        {chat?.conversationInfor?.avtGroupImg !== '' &&
          chat?.conversationInfor?.avtGroupImg !== null &&
          imageFile === '' && (
            <Typography className="delete" onClick={deleteAvatar}>
              Delete Current Photo
            </Typography>
          )}
        <input
          type="file"
          ref={imageRef}
          style={{ display: ' none' }}
          onChange={(e) => {
            handleImageUpload(e.target.files, setImageFile, true);
            uiStore?.setLoading(true);
          }}
        />
        {imageFile !== '' ? (
          <Typography className="delete" onClick={handleLinkClick}>
            Other Picture
          </Typography>
        ) : (
          <Typography className="choose_image" onClick={handleLinkClick}>
            Choose from computer
          </Typography>
        )}
        {imageFile !== '' && (
          <Typography className="choose_image" onClick={updateAvatar}>
            Submit
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default AvatarGroup;
