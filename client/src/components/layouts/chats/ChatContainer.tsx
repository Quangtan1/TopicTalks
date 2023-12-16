import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useContext, memo, useState } from 'react';
import './ChatContainer.scss';
import ListMessage from '../../defaultLayout/ListMessage';
import ChatBox from './ChatBox';
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import ChatContext from 'src/context/ChatContext';
import chatStore from 'src/store/chatStore';
import ConversationSetting from './ConversationSetting';
import uiStore from 'src/store/uiStore';
import ListConversation from './ListConversation';
import SideBarMessage from './SideBarMessage';
import Loading from 'src/components/loading/Loading';

const ChatContainer = observer(() => {
  const { message, setMessage } = useContext(ChatContext);
  const account = accountStore?.account;
  const accountJwt = account;
  const chat = chatStore?.selectedChat;
  const [page, setPage] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  const [isLoadMessage, setIsLoadMessage] = useState<boolean>(false);

  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };
  const axiosJWT = createAxios(accountJwt, setAccount);

  const fetchApi = (page: number) => {
    setIsLoadMessage(true);
    getDataAPI(`/message/${chat?.conversationInfor?.id}?page=${page}&size=10`, account.access_token, axiosJWT)
      .then((res) => {
        const newMessage = res.data.content;
        page === 0 ? setMessage(newMessage) : setMessage([...newMessage, ...message]);
        setIsLoadMessage(false);
        const lengthData = res.data.content.length;
        (lengthData === 0 || lengthData < 10) && setIsLast(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (chat !== null && chat !== undefined) {
      fetchApi(0);
    }
    return () => {
      setPage(0);
      setIsLast(true);
    };
  }, [chat]);

  useEffect(() => {
    if (page !== 0 && isLast) {
      fetchApi(page);
    }
  }, [page]);

  const isGroup = chat?.conversationInfor?.isGroupChat;

  return (
    <Box className="chat_container">
      {uiStore?.loading && <Loading />}
      <SideBarMessage />
      <ListConversation />
      <ChatBox chat={chat} isLoadMessage={isLoadMessage} setPage={setPage} />
      {chat !== null && isGroup && <ConversationSetting chat={chat} />}
    </Box>
  );
});

export default memo(ChatContainer);
