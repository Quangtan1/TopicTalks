import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { BiPhoneCall } from 'react-icons/bi';
import { BsCameraVideo, BsThreeDotsVertical } from 'react-icons/bs';
import { GrSend } from 'react-icons/gr';
import { ImAttachment } from 'react-icons/im';
import { RiEmotionLaughLine } from 'react-icons/ri';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const ChatBox = () => {
  const [currentContent, setCurrentContent] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const addEmoji = (emoji) => {
    setCurrentContent(currentContent + emoji.native);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
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
      <Box className="chat_box">
        {showEmojiPicker && (
          <span>
            <Picker data={data} onEmojiSelect={addEmoji} className="emoiji_box" />
          </span>
        )}
      </Box>

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
        <GrSend className="send_icon" />
      </Box>
    </Box>
  );
};

export default ChatBox;
