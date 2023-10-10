import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Avatar } from '@mui/material';
import { BiPhoneCall } from 'react-icons/bi';
import { BsCameraVideo } from 'react-icons/bs';
import { GrSend } from 'react-icons/gr';
import { ImAttachment } from 'react-icons/im';
import { RiEmotionLaughLine } from 'react-icons/ri';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatContext from 'src/context/ChatContext';
import { IMessage } from 'src/types';
import uiStore from 'src/store/uiStore';
import { handleImageUpload } from 'src/utils/helper';
import ReactImageFallback from 'react-image-fallback';
import { CiCircleRemove } from 'react-icons/ci';
import chatStore from 'src/store/chatStore';
import { IoLogoSnapchat } from 'react-icons/io5';
import { ListMesage } from 'src/types/chat.type';
import { FcCallback, FcSettings } from 'react-icons/fc';
import { HiPhoneMissedCall } from 'react-icons/hi';
import AccessTooltip from 'src/components/dialogs/AccessTooltip';

interface ChatProps {
  chat: ListMesage;
  handleOpenSetting: () => void;
}
const ChatBox = observer((props: ChatProps) => {
  const [currentContent, setCurrentContent] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const account = accountStore?.account;
  const isSelecedChat = chatStore?.selectedChat !== null;
  const [imageFile, setImageFile] = useState<string>('');
  const [openAccessTooltip, setOpenAccessTooltip] = useState<boolean>(false);
  const [dataTooltip, setDataTooltip] = useState<IMessage>(null);
  const [topicId, setTopicId] = useState<number>(null);
  const fileInputRef = useRef(null);
  const { chat, handleOpenSetting } = props;

  const isImage = ['.png', 'jpg', '.svg', '.webp'];

  const { message, setMessage, socket, setCallUser, setOpenVideoCall, setTurnMyVideo, setTurnUserVideo } =
    useContext(ChatContext);

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
    if (!chat.conversationInfor.isGroupChat) {
      const receiveMessageDTO = {
        data: {
          message: 'video',
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
    }
  };

  const handleCall = () => {
    if (!chat.conversationInfor.isGroupChat) {
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
      setTurnMyVideo(false);
      setTurnUserVideo(false);
    }
  };

  const addEmoji = (emoji: any) => {
    setCurrentContent(currentContent + emoji.native);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleLinkClick = () => {
    fileInputRef.current.click();
  };

  const handleOpenTooltip = (data: IMessage) => {
    if (isGroup) {
      setTopicId(chat?.conversationInfor?.topicChildren.id);
      setDataTooltip(data);
      setOpenAccessTooltip(true);
    }
  };

  const partnerName = chat?.partnerDTO.filter((item) => item.id !== account.id);
  const imageUser = (message: IMessage) => {
    const image = chat?.partnerDTO.filter((item) => item.id === message.userId).map((item) => item.image);
    return image.toString();
  };

  const isGroup = chat?.conversationInfor.isGroupChat;
  const isMember = isGroup ? chat?.isMember : 'true';

  return (
    <Box className="chatbox_container">
      <Box className="chatbox_header">
        {isSelecedChat && isMember === 'true' && (
          <>
            <Box className="title_name">
              <Typography>{isGroup ? chat.conversationInfor.chatName : partnerName[0].username}</Typography>
              <Typography>({chat?.conversationInfor?.topicChildren.topicChildrenName})</Typography>
            </Box>

            <Box className="header_option">
              {!isGroup && (
                <>
                  <BiPhoneCall onClick={handleCall} />
                  <BsCameraVideo onClick={handleCallVideo} />
                </>
              )}
              <FcSettings onClick={handleOpenSetting} />
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
        {isSelecedChat && isMember === 'true' ? (
          <Box className="list_message">
            {message.length > 0 &&
              message.map((item: IMessage, index) => (
                <Box id={item.userId === account.id ? 'you' : 'other'} className="message" key={index}>
                  {item.userId !== account.id && (
                    <Avatar
                      src={imageUser(item)}
                      alt="avatar"
                      className={isGroup && 'avatar'}
                      onClick={() => handleOpenTooltip(item)}
                    />
                  )}
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
                            {item.data.message.includes('MA01410') ? (
                              <>
                                <HiPhoneMissedCall className="missing_call" /> Missing Call
                              </>
                            ) : (
                              <>
                                <FcCallback /> in {item.data.message.split(',')[1].trim()}
                              </>
                            )}
                          </Typography>
                        ) : (
                          <Typography className="message_content">{item.data.message}</Typography>
                        )}
                      </>
                    )}

                    <Typography className="messge_username">{item.username}</Typography>
                  </Box>

                  {item.userId === account.id && <Avatar src={account.url_img} alt="avatar" />}
                </Box>
              ))}
          </Box>
        ) : (
          <Box className="sologan_conversation">
            <Box className="icon-container">
              <IoLogoSnapchat className="icon" />
              <IoLogoSnapchat className="icon" />
              <IoLogoSnapchat className="icon" />
              <IoLogoSnapchat className="icon" />
              <IoLogoSnapchat className="icon" />
            </Box>
            {(isSelecedChat && isMember === 'false') || (isGroup && chat?.isMember === undefined) ? (
              <Typography className="waiting_approve_text">
                Wating Approve from Admin <strong> {chat?.conversationInfor.chatName}</strong>
              </Typography>
            ) : (
              <>
                <Typography>Let Started Anonymous Chat </Typography>
                <Typography>A place where you can express yourself without fear of judgment.</Typography>
              </>
            )}
          </Box>
        )}
      </ScrollToBottom>

      <Box className="chatbox_footer">
        {isSelecedChat && isMember === 'true' && (
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
      {openAccessTooltip && (
        <AccessTooltip
          open={openAccessTooltip}
          onClose={() => setOpenAccessTooltip(false)}
          dataTooltip={dataTooltip}
          topicId={topicId}
        />
      )}
    </Box>
  );
});

export default memo(ChatBox);
