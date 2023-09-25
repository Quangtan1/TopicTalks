import React, { useContext, useEffect, useRef, useState } from 'react';
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

var socket, selectedChatCompare;

const ChatBox = observer(() => {
  const [currentContent, setCurrentContent] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const account = accountStore?.account;
  const [imageFile, setImageFile] = useState<string>('');
  const fileInputRef = useRef(null);

  //video call
  const [openVideoCall, setOpenVideoCall] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();
  const myVideo = useRef(null);
  const userVideo = useRef();
  const connectionRef = useRef();

  const isImage = ['.png', 'jpg', '.svg'];

  const { message, setMessage } = useContext(ChatContext);

  useEffect(() => {
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream: MediaStream) => {
    //   setStream(stream);
    //   myVideo.current.srcObject = stream;
    // });

    socket = io(`http://localhost:8085?uid=${account.id}`);
    socket.on('connect', () => {
      console.log('Connect Socket.IO');
    });

    const handleReceiveMessage = (receiveMessageDTO: IMessage) => {
      setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
      console.log('receiveMessage', receiveMessageDTO);
    };

    socket.on('sendMessage', handleReceiveMessage);
    return () => {
      socket.on('disconnect', () => {
        console.log('Disconnect Socket.IO');
      });
      socket.disconnect();
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
        TargetId: account.id,
        userId: account.id,
        conversationId: 3,
      };
      const stateMessage = {
        data: {
          message: message,
        },
        username: account.username,
        userId: account.id,
        conversationId: 3,
      };
      socket.emit('sendMessage', receiveMessageDTO);
      setMessage((prevMessages) => [...prevMessages, stateMessage]);
      setCurrentContent('');
      setImageFile('');
    }
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
    //     5: '2023-09-22T17:05:40.065964',
    //     7: '2023-09-22T17:05:40.065964',
    //   },
    //   amount: 2,
    //   topicChildId: 1,
    // };
    // socket.emit('initChatSingle', request);
  };

  const handleLinkClick = () => {
    fileInputRef.current.click();
  };

  const handleLeaveCall = () => {
    setOpenVideoCall(false);
  };

  return (
    <Box className="chatbox_container">
      <Box className="chatbox_header">
        <Typography>Jenny Wilson</Typography>
        <Box className="header_option">
          <BiPhoneCall onClick={initChat} />
          <BsCameraVideo />
          <BsThreeDotsVertical />
        </Box>
      </Box>
      <ScrollToBottom className="chat_box">
        {showEmojiPicker && (
          <span>
            <Picker data={data} onEmojiSelect={addEmoji} className="emoiji_box" />
          </span>
        )}
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
                    <Typography className="message_content">{item.data.message}</Typography>
                  )}

                  <Typography className="messge_username">{item.username}</Typography>
                </Box>

                {item.userId === account.id && <Avatar alt="avatar" className="avatar" />}
              </Box>
            ))}
        </Box>
      </ScrollToBottom>

      <Box className="chatbox_footer">
        <ImAttachment onClick={handleLinkClick} />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: ' none' }}
          onChange={(e) => {
            handleImageUpload(e.target.files, setImageFile);
            uiStore?.setLoading(true);
          }}
        />
        {imageFile !== '' && (
          <span className="image-name">
            <Typography>{imageFile.slice(0, 12)}...</Typography>
            <span>
              <CiCircleRemove onClick={() => setImageFile('')} />
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
      </Box>
      <VideoCall open={openVideoCall} onLeaveCall={handleLeaveCall} />
    </Box>
  );
});

export default ChatBox;
