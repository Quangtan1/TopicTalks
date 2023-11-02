import React, { memo, useEffect, useState, useContext } from 'react';
import { Box, Typography, TextField, List, ListItem, Avatar, ListItemText, InputAdornment } from '@mui/material';
import { BsChatDots, BsDot } from 'react-icons/bs';
import { AiOutlineUsergroupAdd, AiOutlineUsergroupDelete } from 'react-icons/ai';
import { GrGroup } from 'react-icons/gr';
import accountStore from 'src/store/accountStore';
import { CiLogout, CiSearch, CiSettings } from 'react-icons/ci';
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
import { Circle, FiberManualRecordTwoTone } from '@mui/icons-material';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { useNavigate } from 'react-router-dom';

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
const LOGOUT_CONTENT = 'Do you want to logout?';
const ListConversation = observer(() => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [sortChats, setSortChat] = useState<ListMesage[]>([]);
  const [openLogout, setOpenLogout] = useState<boolean>(false);
  const account = accountStore?.account;

  const { socket, openRandom, setOpenRandom, notification, setNotification } = useContext(ChatContext);

  const chat = chatStore?.selectedChat;
  const listChats = chatStore?.chats;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const navigate = useNavigate();

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const setSelectedChat = (selectChat: ListMesage) => {
    if (socket) {
      socket.emit('onJoinRoom', selectChat.conversationInfor.id);
    }
    const newNotifi = notification.filter((item) => item.conversationId !== selectChat.conversationInfor.id);
    setNotification(newNotifi);
    getDataAPI(`/participant/uid=${account.id}&&cid=${selectChat.conversationInfor.id}`, account.access_token, axiosJWT)
      .then((res) => {
        chatStore?.setSelectedChat(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  const partnerName = (partner) => {
    const usernames = partner.filter((item) => item.id !== account.id).map((item) => item.username);
    return usernames;
  };
  const isActive = (chat: ListMesage) => {
    const result = chat.partnerDTO.some((item) => item.active);
    return result;
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

  const onConfirm = () => {
    accountStore?.setAccount(null);
    accountStore?.clearStore();
    navigate('/auth');
  };

  return (
    <Box className="list_conversation_container">
      <Box className="list_header">
        <Typography className="title_chat">Chat Rooms</Typography>
        <span>
          <GiPerspectiveDiceSixFacesRandom className="icon" onClick={() => setOpenRandom(true)} />
          <AiOutlineUsergroupAdd className="icon" onClick={() => setOpen(true)} />
        </span>
      </Box>
      <Box className="chat_option">
        <TextField
          required
          placeholder="Search here..."
          autoFocus
          className="search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CiSearch />
              </InputAdornment>
            ),
          }}
        />
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
                <span className="active_avatar">
                  <Avatar src={`${item?.conversationInfor.isGroupChat ? '' : imageUser(item?.partnerDTO)}`} alt="avt" />
                  {isActive(item) ? (
                    <FiberManualRecordTwoTone className="online" />
                  ) : (
                    <FiberManualRecordTwoTone className="offline" />
                  )}
                </span>
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
                <span className="active_avatar">
                  <Avatar src={`${item.userid === account.id ? item.friendUrl : item.userUrl}`} alt="avt" />
                  {(item.userid === account.id ? item.friendActive : item.userActive) ? (
                    <FiberManualRecordTwoTone className="online" />
                  ) : (
                    <FiberManualRecordTwoTone className="offline" />
                  )}
                </span>

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
        <CiLogout onClick={() => setOpenLogout(true)} />
      </Box>
      {openRandom && <RandomDialog open={openRandom} onClose={() => setOpenRandom(false)} />}
      {open && <CreateGroupDialog open={open} onClose={() => setOpen(false)} />}
      {openLogout && (
        <DialogCommon
          open={openLogout}
          onClose={() => setOpenLogout(false)}
          onConfirm={onConfirm}
          content={LOGOUT_CONTENT}
        />
      )}
    </Box>
  );
});

export default memo(ListConversation);
