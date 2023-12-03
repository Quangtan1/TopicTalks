import React, { memo, useEffect, useState, useContext } from 'react';
import { Box, Typography, TextField, List, ListItem, Avatar, ListItemText, InputAdornment } from '@mui/material';
import { BsChatDots, BsDot } from 'react-icons/bs';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd, AiOutlineUsergroupDelete } from 'react-icons/ai';
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
import { Circle, FiberManualRecord, FiberManualRecordTwoTone } from '@mui/icons-material';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { useNavigate } from 'react-router-dom';
import { FaEnvelopeOpen, FaImage } from 'react-icons/fa';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { RiDeleteBack2Line } from 'react-icons/ri';
import { HiPhoneMissedCall } from 'react-icons/hi';
import { FcCallback } from 'react-icons/fc';
import { formatTime, formatTimeMessage } from 'src/utils/helper';

const notifeMessageData = [
  {
    keyword: 'Approve',
    prefix: '',
    highlightResult: true,
    suffix: ' has just approved to the group',
    icon: <AiOutlineUserAdd className="add_icon" />,
  },
  {
    keyword: 'Reject',
    prefix: 'Refused',
    highlightResult: true,
    suffix: ' to join the group',
    icon: <IoCloseCircleOutline className="reject_icon" />,
  },
  {
    keyword: 'Remove',
    prefix: '',
    highlightResult: true,
    suffix: ' has just been deleted from the Group',
    icon: <RiDeleteBack2Line className="reject_icon" />,
  },
  {
    keyword: 'Leave',
    prefix: '',
    highlightResult: true,
    suffix: ' just left the Group',
    icon: null,
  },
  {
    keyword: 'UpdateGroupName',
    prefix: 'Group Name changed',
    highlightResult: true,
    suffix: '',
    icon: null,
  },
  {
    keyword: 'UpdateImage',
    prefix: '',
    highlightResult: true,
    suffix: 'changed group image',
    icon: null,
  },
];

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
  const [inputSearch, setInputSearch] = useState<string>('');
  const [dataFilter, setDataFilter] = useState<ListMesage[] | IFriends[]>([]);
  const account = accountStore?.account;
  const isImage = ['.png', 'jpg', '.svg', '.webp', '.jpeg'];

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
    getDataAPI(`/participant/${account?.id}/all`, account?.access_token, axiosJWT)
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

  useEffect(() => {
    if (selectedTab === 0) {
      setSortChat(listChats);
    } else if (selectedTab === 2) {
      const groupChat = listChats?.filter((item) => item.conversationInfor.isGroupChat);
      setSortChat(groupChat);
    }
  }, [selectedTab, listChats]);

  const partnerName = (partner) => {
    const usernames = partner.filter((item) => item.id !== account.id).map((item) => item.username);
    return usernames;
  };
  const isActive = (chat: ListMesage) => {
    const result = chat.partnerDTO.some((item) => item.active);
    return result;
  };
  const listFriend = friendStore?.friends && friendStore?.friends.filter((item) => item.accept);
  const handleSelectTab = (tab: number) => {
    setSelectedTab(tab);
    // if (tab === 0) {
    //   chatStore?.setChats(sortChats);
    // } else if (tab === 2) {
    //   const groupChat =
    //     chatStore?.chats !== null && chatStore?.chats.filter((item) => item.conversationInfor.isGroupChat);
    //   chatStore?.setChats(groupChat);
    // }
  };

  const imageUser = (partnerDTO: IPartnerDTO[]) => {
    const image = partnerDTO.filter((item) => item.id !== account.id).map((item) => item.image);
    return image.toString();
  };

  const isCheckNotifi = (id: number) => {
    return notification?.some((item) => item.conversationId === id);
  };

  const onConfirm = () => {
    accountStore?.setAccount(null);
    accountStore?.clearStore();
    navigate('/auth');
  };

  const notifiGroup = (message: string) => {
    const result = message.split(',')[2]?.trim() === account.username ? 'You' : message.split(',')[2].trim();
    let notification: any = '';

    notifeMessageData.forEach((item) => {
      if (message.includes(item.keyword)) {
        const prefix = item.prefix ? `${item.prefix} ` : '';
        const suffix = item.suffix ? ` ${item.suffix}` : '';
        const name = item.highlightResult ? <strong>{result}</strong> : '';
        const icon = item.icon ? item.icon : null;

        notification = (
          <>
            {prefix}
            {name}
            {suffix}
            {icon}
          </>
        );
      }
    });

    return notification;
  };

  useEffect(() => {
    if (inputSearch !== '') {
      if (selectedTab === 1 && listFriend !== null) {
        const filterFriends = listFriend?.filter((item) =>
          item.userid === account.id
            ? item.friendName.toLowerCase().includes(inputSearch.toLowerCase())
            : item.userName.toLowerCase().includes(inputSearch.toLowerCase()),
        );
        setDataFilter(filterFriends);
      } else if (sortChats?.length > 0) {
        const newListChats = sortChats?.filter((item) =>
          item.conversationInfor.isGroupChat
            ? item.conversationInfor?.chatName.toLowerCase().includes(inputSearch.toLowerCase())
            : item.partnerDTO[0]?.username.toLowerCase().includes(inputSearch.toLowerCase()),
        );
        setDataFilter(newListChats);
      }
    } else {
      setDataFilter([]);
    }
  }, [inputSearch]);

  const accessChat = (friendId: number) => {
    const dataRequest = {
      userIdInSession: account.id,
      topicChildrenId: 1,
    };
    uiStore?.setLoading(true);
    postDataAPI(`/participant/${friendId}`, dataRequest, account.access_token, axiosJWT)
      .then((res) => {
        const result = chatStore?.chats.some(
          (item) => item.conversationInfor.id === res.data.data.conversationInfor.id,
        );
        if (result) {
          chatStore?.setSelectedChat(res.data.data);
        } else {
          chatStore?.setChats([res.data.data, ...chatStore?.chats]);
          chatStore?.setSelectedChat(res.data.data);
        }
        setSelectedTab(0);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const listMessageEmty =
    (sortChats?.length === 0 || sortChats === null || sortChats === undefined) && selectedTab !== 1;
  const listFriendEmty = listFriend === null && selectedTab === 1;

  const displayDataFilter = inputSearch !== '' && sortChats?.length > 0 ? dataFilter : sortChats;
  const friendFilter = inputSearch !== '' && listFriend !== null ? dataFilter : listFriend;

  const sortListChat =
    displayDataFilter !== null &&
    displayDataFilter !== undefined &&
    displayDataFilter?.slice()?.sort((a, b) => {
      const dateA = new Date(a?.conversationInfor?.lastMessage?.timeAt).getTime();
      const dateB = new Date(b?.conversationInfor?.lastMessage?.timeAt).getTime();
      return Math.floor(dateB / 1000) - Math.floor(dateA / 1000);
    });

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
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          onBlur={() => setInputSearch('')}
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
            sortListChat?.map((item) => (
              <ListItem
                key={item?.conversationInfor.id}
                className={`${chat?.conversationInfor?.id === item.conversationInfor.id && 'selected_chat'} chat_item`}
                onClick={() => setSelectedChat(item)}
              >
                <span className="active_avatar">
                  <Avatar
                    src={
                      item?.conversationInfor.isGroupChat
                        ? item.conversationInfor.avtGroupImg
                        : imageUser(item?.partnerDTO)
                    }
                    alt="avt"
                  />
                  {isActive(item) ? (
                    <FiberManualRecordTwoTone className="online" />
                  ) : (
                    <FiberManualRecordTwoTone className="offline" />
                  )}
                </span>
                <ListItemText className="chat_text_item">
                  <Typography className={`${isCheckNotifi(item.conversationInfor.id) && 'notifi'} username`}>
                    {item.conversationInfor.isGroupChat === true
                      ? item.conversationInfor.chatName
                      : partnerName(item.partnerDTO)}
                  </Typography>
                  <Box className={`${isCheckNotifi(item.conversationInfor.id) && 'notifi'} last_message`}>
                    <Typography>
                      {item.conversationInfor?.lastMessage?.senderId === account.id
                        ? 'You'
                        : item.conversationInfor?.lastMessage?.userName}
                      :
                    </Typography>
                    {item.conversationInfor?.lastMessage?.message.includes('isCallCA01410') ? (
                      <Typography className="message_content">
                        {item.conversationInfor?.lastMessage?.message.includes('MA01410') ? (
                          <>
                            <HiPhoneMissedCall className="missing_call" /> Missing Call
                          </>
                        ) : (
                          <>
                            <FcCallback /> in {item.conversationInfor?.lastMessage?.message.split(',')[1].trim()}
                          </>
                        )}
                      </Typography>
                    ) : isImage.some(
                        (ext) =>
                          item.conversationInfor?.lastMessage?.message.endsWith(ext) &&
                          item.conversationInfor?.lastMessage?.message.length > 90,
                      ) ? (
                      <FaImage />
                    ) : (
                      <Typography>
                        {item.conversationInfor?.lastMessage?.message.includes('option_1410#$#')
                          ? notifiGroup(item.conversationInfor?.lastMessage?.message)
                          : item.conversationInfor?.lastMessage?.message}
                      </Typography>
                    )}
                    <Typography className="time_item">
                      {item.conversationInfor?.lastMessage?.timeAt &&
                        formatTimeMessage(item.conversationInfor?.lastMessage?.timeAt)}
                    </Typography>
                  </Box>
                </ListItemText>

                <FiberManualRecord className={`dot ${!isCheckNotifi(item.conversationInfor.id) && 'not_notifi'}`} />
              </ListItem>
            ))}
          {selectedTab === 1 &&
            friendFilter?.map((item) => (
              <ListItem
                key={item?.friendListId}
                className={`chat_item`}
                onClick={() => accessChat(item.userid === account.id ? item.friendId : item.userid)}
              >
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
          {((displayDataFilter?.length === 0 && selectedTab !== 1) ||
            (friendFilter?.length === 0 && selectedTab === 1) ||
            listMessageEmty ||
            listFriendEmty) && (
            <Box className="box_no_data">
              <span>
                <FaEnvelopeOpen />
              </span>
              <Typography>There is no data</Typography>
            </Box>
          )}
        </List>
      </Box>
      <Box className="chat_setting">
        <Box className="infor_box">
          <Avatar src={account?.url_img} alt="avt" />
          <Typography>{account?.username}</Typography>
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
