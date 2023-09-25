import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useContext } from 'react';
import './ChatContainer.scss';
import ListMessage from './ListMessage';
import ChatBox from './ChatBox';
import uiStore from 'src/store/uiStore';
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import ChatContext from 'src/context/ChatContext';
import chatStore from 'src/store/chatStore';

const ChatContainer = observer(() => {
  const { setMessage } = useContext(ChatContext);
  const account = accountStore?.account;
  const accountJwt = account;
  const chat = chatStore?.selectedChat;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    if (chat !== null)
      getDataAPI(`/message/${chat.conversationInfor.id}`, account.access_token, axiosJWT)
        .then((res) => {
          setMessage(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [chat]);

  const isResize = uiStore?.collapse;
  return (
    <Box className={`chat_container ${isResize ? 'expand_chat' : 'collapse_chat'}`}>
      <ListMessage />
      <ChatBox />
    </Box>
  );
});

export default ChatContainer;
