import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, Avatar } from '@mui/material';
import { BiPhoneCall } from 'react-icons/bi';
import { BsCameraVideo, BsThreeDotsVertical } from 'react-icons/bs';
import { GrSend } from 'react-icons/gr';
import { ImAttachment } from 'react-icons/im';
import { RiEmotionLaughLine } from 'react-icons/ri';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import fakeMessages from './fakeMessages.json';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatContext from 'src/context/ChatContext';

const ChatBox = observer(() => {
  const [currentContent, setCurrentContent] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const account = accountStore?.account;

  const { setMessage } = useContext(ChatContext);

  const addEmoji = (emoji: any) => {
    setCurrentContent(currentContent + emoji.native);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const sendMessage = () => {
    if (currentContent !== '') {
      setMessage(currentContent);
    }
  };

  return (
    <Box className="chatbox_container">
      <Box className="chatbox_header">
        <Typography>Jenny Wilson</Typography>
        <Box className="header_option">
          <BiPhoneCall />
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
          {fakeMessages.map((item, index) => (
            <Box id={item.userId === account.id ? 'you' : 'other'} className="message" key={index}>
              {item.userId !== account.id && <Avatar src={item.avatar} alt="avatar" className="avatar" />}
              <Box className="message_box">
                <Typography className="message_content">{item.content}</Typography>
                <Typography className="messge_username">{item.userName}</Typography>
              </Box>

              {item.userId === account.id && <Avatar src={item.avatar} alt="avatar" className="avatar" />}
            </Box>
          ))}
        </Box>
      </ScrollToBottom>

      <Box className="chatbox_footer">
        <ImAttachment />
        <RiEmotionLaughLine onClick={toggleEmojiPicker} />
        <TextField
          required
          placeholder="Write Your message"
          autoFocus
          className="chatbox_input"
          value={currentContent}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            setCurrentContent(e.target.value);
          }}
        />
        <GrSend className="send_icon" onClick={sendMessage} />
      </Box>
    </Box>
  );
});

export default ChatBox;
