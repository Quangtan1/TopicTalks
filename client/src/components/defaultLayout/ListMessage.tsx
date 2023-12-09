import React, { memo, useEffect, useState, useContext } from 'react';
import { Box, Typography, TextField, List, ListItem, Avatar, ListItemText } from '@mui/material';
import { BsChatDots, BsDot } from 'react-icons/bs';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd, AiOutlineUsergroupDelete } from 'react-icons/ai';
import { GrGroup } from 'react-icons/gr';
import accountStore from 'src/store/accountStore';
import { CiCircleMore, CiSettings } from 'react-icons/ci';
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
import './ListMessage.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelopeOpen } from 'react-icons/fa';
import { HiPhoneMissedCall } from 'react-icons/hi';
import { FcCallback } from 'react-icons/fc';
import { formatTimeMessage } from 'src/utils/helper';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { RiDeleteBack2Line } from 'react-icons/ri';

const tabOption = [
  {
    id: 0,
    icon: <BsChatDots />,
    content: 'Messages',
  },
  {
    id: 2,
    icon: <GrGroup />,
    content: 'Groups',
  },
];

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
    suffix: ' has just deleted from the Group',
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
interface ListMessageProps {
  sortChats: ListMesage[];
  setSortChat: React.Dispatch<React.SetStateAction<ListMesage[]>>;
}

const ListMessage = observer((props: ListMessageProps) => {
  const { sortChats, setSortChat } = props;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<ListMesage[]>([]);
  const [inputSearch, setInputSearch] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const account = accountStore?.account;

  const { socket, openRandom, setOpenRandom, notification, setNotification } = useContext(ChatContext);

  const chat = chatStore?.selectedChat;
  const listChats = chatStore?.chats;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const setSelectedChat = (selectChat: ListMesage) => {
    // if (socket) {
    //   socket.emit('onJoinRoom', selectChat.conversationInfor.id);
    // }
    const newNotifi = notification.filter((item) => item.conversationId !== selectChat.conversationInfor.id);
    setNotification(newNotifi);
    getDataAPI(`/participant/uid=${account.id}&&cid=${selectChat.conversationInfor.id}`, account.access_token, axiosJWT)
      .then((res) => {
        currentPath !== '/message' && navigate('/message');
        currentPath !== '/message'
          ? setTimeout(() => {
              chatStore.setSelectedChat(res.data.data);
            }, 300)
          : chatStore.setSelectedChat(res.data.data);
        chatStore?.setChats([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    uiStore?.setCollapse(true);
    setFilterData(listChats);
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
      setFilterData(sortChats);
      chatStore?.setChats(sortChats);
    } else if (tab === 2) {
      const groupChat =
        chatStore?.chats !== null && chatStore?.chats.filter((item) => item.conversationInfor.isGroupChat);
      chatStore?.setChats(groupChat);
      setFilterData(groupChat);
    }
  };

  const imageUser = (partnerDTO: IPartnerDTO[]) => {
    const image = partnerDTO.filter((item) => item.id !== account.id).map((item) => item.image);
    return image.toString();
  };

  const isCheckNotifi = (id) => {
    const arr = [];
    if (Array.isArray(notification)) {
      notification?.forEach((item) => {
        if (item.conversationId === id) {
          arr.push(id);
        }
      });
    }
    return arr.length;
  };

  useEffect(() => {
    if (inputSearch !== '') {
      const newlistChats = listChats?.filter((item) =>
        item.conversationInfor.isGroupChat
          ? item.conversationInfor.chatName.toLowerCase().includes(inputSearch.toLowerCase())
          : item.partnerDTO[0].username.toLowerCase().includes(inputSearch.toLowerCase()),
      );
      setFilterData(newlistChats);
    } else {
      setFilterData(listChats);
    }
  }, [inputSearch, selectedTab]);

  const uiDisplay = uiStore?.collapse;

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

  const processMessage = (message: string) => {
    const mentionRegex = /(@\[(\w+)\]\((\d+)\))/g;
    const matches =
      message &&
      Array?.from(message?.matchAll(mentionRegex), (match) => ({
        mention: match[1],
        username: match[2],
        memberId: match[3],
      }));

    if (matches?.length > 0 && message) {
      const renderedElements = [];
      let lastIndex = 0;

      matches?.forEach((match, index) => {
        const mentionIndex = message?.indexOf(match?.mention, lastIndex);

        if (mentionIndex > lastIndex) {
          const textElement = `${message?.slice(lastIndex, mentionIndex)}`;
          renderedElements.push(textElement);
        }

        const mentionElement = <strong key={`mention-${index}`}>{`@${match?.username}`}</strong>;
        renderedElements.push(mentionElement);

        lastIndex = mentionIndex + match?.mention.length;
      });

      if (lastIndex < message?.length) {
        const textElement = `${message?.slice(lastIndex)}`;
        renderedElements.push(textElement);
      }

      return renderedElements;
    } else {
      return `${message || ''}`;
    }
  };
  const sortListChat =
    filterData !== null &&
    filterData !== undefined &&
    filterData?.slice()?.sort((a, b) => {
      const dateA = new Date(a?.conversationInfor?.lastMessage?.timeAt).getTime();
      const dateB = new Date(b?.conversationInfor?.lastMessage?.timeAt).getTime();
      return Math.floor(dateB / 1000) - Math.floor(dateA / 1000);
    });
  return (
    <Box
      className={`${uiDisplay ? 'list_message_collap' : 'list_message_container'} ${
        listChats?.length > 0 ? 'visible_list_message' : 'disable_list'
      } `}
    >
      {!uiDisplay ? (
        <>
          <Typography className="title_chat">Your List Message</Typography>
          <Box className="chat_option">
            <TextField
              required
              placeholder="Search..."
              autoFocus
              className="search"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
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
                    className={`${
                      chat?.conversationInfor?.id === item.conversationInfor.id && 'selected_chat'
                    } chat_item`}
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
                        {item.conversationInfor?.lastMessage?.message?.includes('isCallCA01410') ? (
                          <Typography className="message_content">
                            {item.conversationInfor?.lastMessage?.message?.includes('MA01410') ? (
                              <>
                                <HiPhoneMissedCall className="missing_call" /> Missing Call
                              </>
                            ) : (
                              <>
                                <FcCallback /> in {item.conversationInfor?.lastMessage?.message.split(',')[1].trim()}
                              </>
                            )}
                          </Typography>
                        ) : (
                          <Typography>
                            {item.conversationInfor?.lastMessage?.message?.includes('option_1410#$#')
                              ? notifiGroup(item.conversationInfor?.lastMessage?.message)
                              : processMessage(item.conversationInfor?.lastMessage?.message)}
                          </Typography>
                        )}
                        <Typography className="time_item">
                          {item.conversationInfor?.lastMessage?.userName
                            ? formatTimeMessage(item.conversationInfor?.lastMessage?.timeAt)
                            : ''}
                        </Typography>
                      </Box>
                    </ListItemText>
                    <FiberManualRecord
                      className={`dot ${isCheckNotifi(item.conversationInfor.id) === 0 && 'not_notifi'}`}
                    />
                  </ListItem>
                ))}
              {filterData?.length === 0 && (
                <Box className="box_no_data">
                  <span>
                    <FaEnvelopeOpen />
                  </span>
                  <Typography>There is no data</Typography>
                </Box>
              )}
            </List>
          </Box>
        </>
      ) : (
        <Box className="list_chat_box">
          <List className="list_box">
            <ListItem className="show_more" onClick={() => uiStore?.setCollapse(false)}>
              <CiCircleMore />
            </ListItem>
            {listChats?.length > 0 &&
              sortListChat?.slice(0, 5)?.map((item) => (
                <ListItem
                  key={item?.conversationInfor.id}
                  className="collapse_chat_item"
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
                      title={
                        item?.conversationInfor.isGroupChat
                          ? item.conversationInfor.chatName
                          : partnerName(item?.partnerDTO)
                      }
                      className="avatar"
                    />
                    {isActive(item) ? (
                      <FiberManualRecordTwoTone className="online" />
                    ) : (
                      <FiberManualRecordTwoTone className="offline" />
                    )}
                    {isCheckNotifi(item.conversationInfor.id) > 0 && (
                      <span className="notifi">{isCheckNotifi(item.conversationInfor.id)}</span>
                    )}
                  </span>
                  {/* <TbCircleDotFilled
                    className={`dot_collapse ${!isCheckNotifi(item.conversationInfor.id) && 'not_notifi'}`}
                  /> */}
                </ListItem>
              ))}
          </List>
        </Box>
      )}

      {openRandom && <RandomDialog open={openRandom} onClose={() => setOpenRandom(false)} />}
      {open && <CreateGroupDialog open={open} onClose={() => setOpen(false)} />}
    </Box>
  );
});

export default memo(ListMessage);
