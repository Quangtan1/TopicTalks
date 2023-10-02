import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Avatar } from '@mui/material';
import { BiPhoneCall } from 'react-icons/bi';
import { BsCameraVideo, BsThreeDotsVertical } from 'react-icons/bs';
import { GrSend } from 'react-icons/gr';
import { ImAttachment } from 'react-icons/im';
import { RiEmotionLaughLine } from 'react-icons/ri';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatContext from 'src/context/ChatContext';
import { io } from 'socket.io-client';
import { IMessage } from 'src/types';
import uiStore from 'src/store/uiStore';
import { handleImageUpload } from 'src/utils/helper';
import ReactImageFallback from 'react-image-fallback';
import { CiCircleRemove } from 'react-icons/ci';
import VideoCall from './videocall/VideoCall';
import chatStore from 'src/store/chatStore';
import { IoLogoSnapchat } from 'react-icons/io5';
import { ICallData, ListMesage } from 'src/types/chat.type';
import Peer from 'simple-peer';
import { FcCallback } from 'react-icons/fc';

interface ChatProps {
  chat: ListMesage;
}
const ChatBox = observer((props: ChatProps) => {
  const [currentContent, setCurrentContent] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const account = accountStore?.account;
  const isSelecedChat = chatStore?.selectedChat !== null;
  const [imageFile, setImageFile] = useState<string>('');
  const fileInputRef = useRef(null);
  const { chat } = props;

  const isImage = ['.png', 'jpg', '.svg', '.webp'];
  // const codeMode = 'CA01410';

  const { message, setMessage, socket, setCallUser, setOpenVideoCall } = useContext(ChatContext);

  useEffect(() => {
    return () => {
      chatStore?.setSelectedChat(null);
    };
  }, []);

  useEffect(() => {
    if (imageFile !== '') {
      uiStore?.setLoading(false);
      setCurrentContent(imageFile);
    }
  }, [imageFile]);

  const sendMessage = (message: string) => {
    if (currentContent !== '') {
      const receiveMessageDTO = {
        data: {
          message: message,
        },
        TargetId: chat.partnerDTO[0].id,
        userId: account.id,
        conversationId: chat.conversationInfor.id,
      };
      const stateMessage = {
        data: {
          message: message,
        },
        username: account.username,
        userId: account.id,
        conversationId: chat.conversationInfor.id,
      };
      socket.emit('sendMessage', receiveMessageDTO);
      setMessage((prevMessages) => [...prevMessages, stateMessage]);
      setCurrentContent('');
      setImageFile('');
    }
  };

  const handleCallVideo = () => {
    const receiveMessageDTO = {
      data: {
        message: 'call',
      },
      targetName: chat.partnerDTO[0].username,
      targetId: chat.partnerDTO[0].id,
      timeAt: new Date().toISOString(),
      userId: account.id,
      username: account.username,
      conversationId: chat.conversationInfor.id,
    };
    socket.emit('1V1CommunicateVideo', receiveMessageDTO);
    setCallUser(receiveMessageDTO);
    setOpenVideoCall(true);
  };

  const addEmoji = (emoji: any) => {
    setCurrentContent(currentContent + emoji.native);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const initChat = () => {
    // const request = {
    //   userInfoRequest: {
    //     6: '2023-09-22T17:05:40.065964',
    //     7: '2023-09-22T17:05:40.065964',
    //   },
    //   amount: 2,
    //   topicChildId: 3,
    // };
    // socket.emit('initChatSingle', request);
  };

  const handleLinkClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box className="chatbox_container">
      <Box className="chatbox_header">
        {isSelecedChat && (
          <>
            <Typography>
              {chat.conversationInfor.isGroupChat === true
                ? chat.conversationInfor.chatName
                : chat.partnerDTO[0].username}
            </Typography>
            <Box className="header_option">
              <BiPhoneCall onClick={initChat} />
              <BsCameraVideo onClick={handleCallVideo} />
              <BsThreeDotsVertical />
            </Box>
          </>
        )}
      </Box>
      <ScrollToBottom className="chat_box">
        {showEmojiPicker && (
          <span>
            <Picker data={data} onEmojiSelect={addEmoji} className="emoiji_box" />
          </span>
        )}
        {!isSelecedChat ? (
          <Box className="sologan_conversation">
            <Box className="icon-container">
              <IoLogoSnapchat className="icon" />
              <IoLogoSnapchat className="icon" />
              <IoLogoSnapchat className="icon" />
              <IoLogoSnapchat className="icon" />
              <IoLogoSnapchat className="icon" />
            </Box>
            <Typography>Let Started Anonymous Chat </Typography>
            <Typography>A place where you can express yourself without fear of judgment.</Typography>
          </Box>
        ) : (
          <Box className="list_message">
            {message.length > 0 &&
              message.map((item: IMessage, index) => (
                <Box id={item.userId === account.id ? 'you' : 'other'} className="message" key={index}>
                  {item.userId !== account.id && <Avatar alt="avatar" className="avatar" />}
                  <Box className="message_box">
                    {isImage.some((ext) => item.data.message.endsWith(ext)) ? (
                      <ReactImageFallback
                        src={item.data.message}
                        fallbackImage={'/path/to/default/image'}
                        initialImage={'/path/to/initial/image'}
                        alt="message image"
                        className="image-message"
                      />
                    ) : (
                      <>
                        {item.data.message.includes('isCallCA01410') ? (
                          <Typography className="message_content">
                            <FcCallback />
                            in {item.data.message.split(',')[1].trim()}
                          </Typography>
                        ) : (
                          <Typography className="message_content">{item.data.message}</Typography>
                        )}
                      </>
                    )}

                    <Typography className="messge_username">{item.username}</Typography>
                  </Box>

                  {item.userId === account.id && <Avatar alt="avatar" className="avatar" />}
                </Box>
              ))}
          </Box>
        )}
      </ScrollToBottom>

      <Box className="chatbox_footer">
        {isSelecedChat && (
          <>
            <ImAttachment onClick={handleLinkClick} />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: ' none' }}
              onChange={(e) => {
                handleImageUpload(e.target.files, setImageFile, false);
                uiStore?.setLoading(true);
              }}
            />
            {imageFile !== '' && (
              <span className="image-name">
                <Typography>{imageFile.slice(0, 12)}...</Typography>
                <span>
                  <CiCircleRemove
                    onClick={() => {
                      setImageFile('');
                      setCurrentContent('');
                    }}
                  />
                </span>
              </span>
            )}
            <RiEmotionLaughLine onClick={toggleEmojiPicker} />
            <TextField
              required
              disabled={imageFile !== ''}
              value={imageFile === '' ? currentContent : 'Send Image First...'}
              placeholder="Type your message"
              autoFocus
              className="chatbox_input"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                setCurrentContent(e.target.value);
              }}
              onKeyDown={(event) => {
                if (event.keyCode === 13 && !event.shiftKey) {
                  sendMessage(currentContent);
                }
              }}
            />
            <GrSend className="send_icon" onClick={() => sendMessage(currentContent)} />
          </>
        )}
      </Box>
      {/* {openVideoCall && (
        <VideoCall
          open={openVideoCall}
          onLeaveCall={handleLeaveCall}
          callUser={callUser}
          receiveCallUser={receiveCallUser}
          acceptCall={acceptCall}
          isAccepted={isAccepted}
          saveCall={saveCall}
        />
      )} */}
    </Box>
  );
});

export default memo(ChatBox);
