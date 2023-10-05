import React, { memo, useEffect, useState } from 'react';
import { Box, Typography, TextField, List, ListItem, Avatar, ListItemText } from '@mui/material';
import { BsChatDots } from 'react-icons/bs';
import { AiOutlineUsergroupAdd, AiOutlineUsergroupDelete } from 'react-icons/ai';
import { GrGroup } from 'react-icons/gr';
import accountStore from 'src/store/accountStore';
import { CiSettings } from 'react-icons/ci';
import { observer } from 'mobx-react';
import { createAxios, getDataAPI } from 'src/utils';
import chatStore from 'src/store/chatStore';
import { ListMesage } from 'src/types/chat.type';
import CreateGroupDialog from 'src/components/dialogs/CreateGroupDialog';

const tabOption = [
  {
    id: 0,
    icon: <BsChatDots />,
    content: 'Messages',
  },
  {
    id: 1,
    icon: <AiOutlineUsergroupDelete />,
    content: 'Friends',
  },
  {
    id: 2,
    icon: <GrGroup />,
    content: 'Groups',
  },
];

const ListMessage = observer(() => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const account = accountStore?.account;

  const chat = chatStore?.selectedChat;
  const listChats = chatStore?.chats;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    getDataAPI(`/participant/${account.id}/all`, account.access_token, axiosJWT)
      .then((res) => {
        chatStore?.setChats(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      chatStore?.setSelectedChat(null);
    };
  }, []);

  const setSelectedChat = (chat: ListMesage) => {
    chatStore?.setSelectedChat(chat);
  };
  return (
    <Box className="list_message_container">
      <Typography className="title_chat">Chat Rooms</Typography>
      <Box className="chat_option">
        <TextField required placeholder="Search..." autoFocus className="search" />
        <AiOutlineUsergroupAdd onClick={() => setOpen(true)} />
      </Box>
      <List className="tab_option">
        {tabOption.map((item) => (
          <ListItem
            key={item.id}
            className={`tab_item ${selectedTab === item.id && 'tab_selected'}`}
            onClick={() => setSelectedTab(item.id)}
          >
            {item.icon}
            <Typography>{item.content}</Typography>
          </ListItem>
        ))}
      </List>
      <Box className="list_chat_box">
        <List className="list_box">
          {listChats?.length > 0 &&
            listChats?.map((item) => (
              <ListItem
                key={item.conversationInfor.id}
                className={`${chat?.conversationInfor.id === item.conversationInfor.id && 'selected_chat'} chat_item`}
                onClick={() => setSelectedChat(item)}
              >
                <Avatar />
                <ListItemText className="chat_text_item">
                  <Typography>
                    {item.conversationInfor.isGroupChat === true
                      ? item.conversationInfor.chatName
                      : item.partnerDTO[0].username}
                  </Typography>
                  <Typography>aaaaa</Typography>
                </ListItemText>
                <Typography className="time_item">8:00</Typography>
              </ListItem>
            ))}
        </List>
      </Box>
      <Box className="chat_setting">
        <Box className="infor_box">
          <Avatar src={account.url_img} alt="avt" />
          <Typography>{account.username}</Typography>
        </Box>
        <CiSettings />
      </Box>
      <CreateGroupDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
});

export default memo(ListMessage);
