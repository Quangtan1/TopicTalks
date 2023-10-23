import React, { memo, useEffect, useState, useContext } from 'react';
import { Box, Typography, TextField, List, ListItem, Avatar, ListItemText } from '@mui/material';
import { BsChatDots, BsDot } from 'react-icons/bs';
import { AiOutlineUsergroupAdd, AiOutlineUsergroupDelete } from 'react-icons/ai';
import { GrGroup } from 'react-icons/gr';
import accountStore from 'src/store/accountStore';
import { CiSettings } from 'react-icons/ci';
import { observer } from 'mobx-react';
import { createAxios, getDataAPI, postDataAPI } from 'src/utils';
import chatStore from 'src/store/chatStore';
import { IPartnerDTO, ListMesage } from 'src/types/chat.type';
import CreateGroupDialog from 'src/components/dialogs/CreateGroupDialog';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import RandomDialog from 'src/components/dialogs/RandomDialog';
import ChatContext from 'src/context/ChatContext';
import uiStore from 'src/store/uiStore';
import friendStore from 'src/store/friendStore';
import { IFriends } from 'src/types/account.types';
import { TbCircleDotFilled } from 'react-icons/tb';

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
  const [sortChats, setSortChat] = useState<ListMesage[]>([]);
  const account = accountStore?.account;

  const { openRandom, setOpenRandom, notification, setNotification } = useContext(ChatContext);

  const chat = chatStore?.selectedChat;
  const listChats = chatStore?.chats;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`/participant/${account.id}/all`, account.access_token, axiosJWT)
      .then((res) => {
        chatStore?.setChats(res.data.data);
        setSortChat(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      chatStore?.setSelectedChat(null);
    };
  }, []);

  const setSelectedChat = (chat: ListMesage) => {
    const newNotifi = notification.filter((item) => item.conversationId !== chat.conversationInfor.id);
    setNotification(newNotifi);
    getDataAPI(`/participant/uid=${account.id}&&cid=${chat.conversationInfor.id}`, account.access_token, axiosJWT)
      .then((res) => {
        chatStore?.setSelectedChat(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const sendEmail = () => {
  //   const email = 'tantqde150382@fpt.edu.vn';

  //   putDataAPI(`/user/regenerate-otp?email=${email}`, {}, account.access_token, axiosJWT)
  //     .then((res) => {
  //       console.log('email', res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const forgetPassword = () => {
    // const email = 'tantqde150382@fpt.edu.vn';
    // postDataAPI(`/user/forgot-password?email=${email}`, {}, account.access_token, axiosJWT)
    //   .then((res) => {
    //     console.log('email', res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const partnerName = (partner) => {
    const usernames = partner.filter((item) => item.id !== account.id).map((item) => item.username);
    return usernames;
  };

  const handleSelectTab = (tab: number) => {
    setSelectedTab(tab);
    if (tab === 0) {
      chatStore?.setChats(sortChats);
    } else if (tab === 2) {
      const groupChat =
        chatStore?.chats !== null && chatStore?.chats.filter((item) => item.conversationInfor.isGroupChat);
      chatStore?.setChats(groupChat);
    }
  };

  const imageUser = (partnerDTO: IPartnerDTO[]) => {
    const image = partnerDTO.filter((item) => item.id !== account.id).map((item) => item.image);
    return image.toString();
  };

  const listFriend = friendStore?.friends.filter((item) => item.accept);

  const isCheckNotifi = (id: number) => {
    return notification?.some((item) => item.conversationId === id);
  };

  return (
    <Box className="list_message_container">
      <Typography className="title_chat">Chat Rooms</Typography>
      <Box className="chat_option">
        <TextField required placeholder="Search..." autoFocus className="search" />
        <GiPerspectiveDiceSixFacesRandom onClick={() => setOpenRandom(true)} />
        <AiOutlineUsergroupAdd onClick={() => setOpen(true)} />
      </Box>
      <List className="tab_option">
        {tabOption.map((item) => (
          <ListItem
            key={item.id}
            className={`tab_item ${selectedTab === item.id && 'tab_selected'}`}
            onClick={() => handleSelectTab(item.id)}
          >
            {item.icon}
            <Typography>{item.content}</Typography>
          </ListItem>
        ))}
      </List>
      <Box className="list_chat_box">
        <List className="list_box">
          {listChats?.length > 0 &&
            selectedTab !== 1 &&
            listChats?.map((item) => (
              <ListItem
                key={item?.conversationInfor.id}
                className={`${chat?.conversationInfor?.id === item.conversationInfor.id && 'selected_chat'} chat_item`}
                onClick={() => setSelectedChat(item)}
              >
                <Avatar src={`${item?.conversationInfor.isGroupChat ? '' : imageUser(item?.partnerDTO)}`} alt="avt" />
                <ListItemText className="chat_text_item">
                  <Typography className={isCheckNotifi(item.conversationInfor.id) && 'notifi'}>
                    {item.conversationInfor.isGroupChat === true
                      ? item.conversationInfor.chatName
                      : partnerName(item.partnerDTO)}
                  </Typography>
                </ListItemText>
                <Typography className="time_item">8:00</Typography>
                <TbCircleDotFilled className={`dot ${!isCheckNotifi(item.conversationInfor.id) && 'not_notifi'}`} />
              </ListItem>
            ))}
          {selectedTab === 1 &&
            listFriend?.map((item) => (
              <ListItem key={item?.friendListId} className={`chat_item`}>
                <Avatar src={`${item.userid === account.id ? item.friendUrl : item.userUrl}`} alt="avt" />
                <ListItemText className="chat_text_item">
                  <Typography>{item.userid === account.id ? item.friendName : item.userName}</Typography>
                </ListItemText>
              </ListItem>
            ))}
          {((listFriend?.length === 0 && selectedTab === 1) || listChats === null) && (
            <Typography className="no_data">There is no data</Typography>
          )}
        </List>
      </Box>
      <Box className="chat_setting">
        <Box className="infor_box">
          <Avatar src={account.url_img} alt="avt" />
          <Typography>{account.username}</Typography>
        </Box>
        <CiSettings onClick={forgetPassword} />
      </Box>
      {openRandom && <RandomDialog open={openRandom} onClose={() => setOpenRandom(false)} />}
      {open && <CreateGroupDialog open={open} onClose={() => setOpen(false)} />}
    </Box>
  );
});

export default memo(ListMessage);
