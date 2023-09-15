import React, { useState } from 'react';
import { Box, Typography, TextField, List, ListItem, Avatar, ListItemText } from '@mui/material';
import { IoCreateOutline } from 'react-icons/io5';
import { BsChatDots } from 'react-icons/bs';
import { AiOutlineUsergroupDelete } from 'react-icons/ai';
import { GrGroup } from 'react-icons/gr';
import fakeChats from './fakeChats.json';
import accountStore from 'src/store/accountStore';
import { CiSettings } from 'react-icons/ci';
import { observer } from 'mobx-react';

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
  const account = accountStore?.account;
  return (
    <Box className="list_message_container">
      <Typography className="title_chat">Chats</Typography>
      <Box className="chat_option">
        <TextField required placeholder="Search..." autoFocus className="search" />
        <IoCreateOutline />
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
          {fakeChats.map((messItem) => (
            <ListItem key={messItem.id} className="chat_item">
              <Avatar />
              <ListItemText className="chat_text_item">
                <Typography>{messItem.nameChat}</Typography>
                <Typography>{messItem.lastMessage}</Typography>
              </ListItemText>
              <Typography className="time_item">{messItem.time}</Typography>
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
    </Box>
  );
});

export default ListMessage;
