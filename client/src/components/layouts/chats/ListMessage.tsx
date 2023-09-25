import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, List, ListItem, Avatar, ListItemText } from '@mui/material';
import { IoCreateOutline } from 'react-icons/io5';
import { BsChatDots } from 'react-icons/bs';
import { AiOutlineUsergroupDelete } from 'react-icons/ai';
import { GrGroup } from 'react-icons/gr';
import accountStore from 'src/store/accountStore';
import { CiSettings } from 'react-icons/ci';
import { observer } from 'mobx-react';
import { createAxios, getDataAPI } from 'src/utils';

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
interface ITopicChild {
  topicChildrenName: string;
}
interface IConversation {
  id: number;
  chatName: string | null;
  isGroupChat: boolean;
  topicChildren: ITopicChild;
}
interface IUserInfor {
  id: number;
  username: string;
  isBanned: boolean;
  imageUrl: string;
}
interface ListMesage {
  conversationInfo: IConversation;
  userInfo: IUserInfor;
}

const ListMessage = observer(() => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [listMessage, setListMessage] = useState<ListMesage[]>([]);
  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    getDataAPI(`/participant/${account.id}/all`, account.access_token, axiosJWT)
      .then((res) => {
        setListMessage(res.data.data);
        console.log('dataaaa11111', res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
          {listMessage?.length > 0 &&
            listMessage?.map((item) => (
              <ListItem key={item.conversationInfo.id} className="chat_item">
                <Avatar />
                <ListItemText className="chat_text_item">
                  <Typography>{item.userInfo.username}</Typography>
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
    </Box>
  );
});

export default ListMessage;
