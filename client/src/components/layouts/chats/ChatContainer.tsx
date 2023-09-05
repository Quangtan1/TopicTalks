import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';
import './ChatContainer.scss';
import ListMessage from './ListMessage';
import ChatBox from './ChatBox';
import uiStore from 'src/store/uiStore';

const ChatContainer = observer(() => {
  const isResize = uiStore?.collapse;
  return (
    <Box className={`chat_container ${isResize ? 'expand_chat' : 'collapse_chat'}`}>
      <ListMessage />
      <ChatBox />
    </Box>
  );
});

export default ChatContainer;
