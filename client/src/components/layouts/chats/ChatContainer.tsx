import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useContext, memo, useState } from 'react';
import './ChatContainer.scss';
import ListMessage from './ListMessage';
import ChatBox from './ChatBox';
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import ChatContext from 'src/context/ChatContext';
import chatStore from 'src/store/chatStore';
import ConversationSetting from './ConversationSetting';
import uiStore from 'src/store/uiStore';

const ChatContainer = observer(() => {
  const { setMessage } = useContext(ChatContext);
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  const account = accountStore?.account;
  const accountJwt = account;
  const chat = chatStore?.selectedChat;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    if (chat !== null) {
      // uiStore?.setLoading(true);
      getDataAPI(`/message/${chat.conversationInfor.id}`, account.access_token, axiosJWT)
        .then((res) => {
          setMessage(res.data);
          // uiStore?.setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [chat]);

  const handleOpenSetting = () => {
    setOpenSetting(!openSetting);
  };

  const isGroup = chat?.conversationInfor?.isGroupChat;
  const isMember = isGroup ? chat?.isMember : 'true';

  return (
    <Box className="chat_container">
      <ListMessage />
      <ChatBox chat={chat} handleOpenSetting={handleOpenSetting} />
      {openSetting && isMember === 'true' && <ConversationSetting chat={chat} setOpenSetting={setOpenSetting} />}
    </Box>
  );
});

export default memo(ChatContainer);
