import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Avatar } from '@mui/material';
import { BiDotsVerticalRounded, BiPhoneCall } from 'react-icons/bi';
import { BsCameraVideo, BsCodeSlash } from 'react-icons/bs';
import { GrSend } from 'react-icons/gr';
import { ImAttachment } from 'react-icons/im';
import { RiDeleteBack2Line, RiEmotionLaughLine, RiLoader2Line } from 'react-icons/ri';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatContext from 'src/context/ChatContext';
import { IMessage } from 'src/types';
import uiStore from 'src/store/uiStore';
import { handleImageUpload } from 'src/utils/helper';
import ReactImageFallback from 'react-image-fallback';
import { CiCircleRemove } from 'react-icons/ci';
import chatStore from 'src/store/chatStore';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { ListMesage } from 'src/types/chat.type';
import { FcCallback } from 'react-icons/fc';
import { HiPhoneMissedCall } from 'react-icons/hi';
import AccessTooltip from 'src/components/dialogs/AccessTooltip';
import friendStore from 'src/store/friendStore';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FiberManualRecordTwoTone } from '@mui/icons-material';
import { createAxios, deleteDataAPI } from 'src/utils';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { useNavigate } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ImageZoom from './zoomImage/ImageZoom';
import { FaImage } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';

///const
const contentGroup = `Do you want to delete this conversation`;
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

interface ChatProps {
  chat: ListMesage;
  isLoadMessage: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
const ChatBox = observer((props: ChatProps) => {
  const [currentContent, setCurrentContent] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const account = accountStore?.account;
  const isSelecedChat = chatStore?.selectedChat !== null;
  const [imageFile, setImageFile] = useState<string>('');
  const [openAccessTooltip, setOpenAccessTooltip] = useState<boolean>(false);
  const [dataTooltip, setDataTooltip] = useState<IMessage>(null);
  const [topicId, setTopicId] = useState<number>(null);
  const [tooltipSetting, setTooltipSetting] = useState<boolean>(false);
  const [openConfirmGroup, setOpenConFirmGroup] = useState<boolean>(false);
  const [snippets, setSnippet] = useState<boolean>(false);
  const [zoomImage, setZoomImage] = useState<string>('');

  const fileInputRef = useRef(null);
  const emoijiRef = useRef(null);
  const chatboxRef = useRef(null);
  const firstRender = useRef(true);
  const { chat, isLoadMessage, setPage } = props;

  const codeSnippets = '%%snippet_syntax1410#$';

  const navigate = useNavigate();

  const isImage = ['.png', 'jpg', '.svg', '.webp', '.jpeg'];

  const optionCode = 'option_1410#$#';

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const isGroup = chat?.conversationInfor.isGroupChat;
  const isMember = isGroup ? chat?.isMember : 'true';

  const { message, setMessage, socket, setCallUser, setOpenVideoCall, setTurnMyVideo, setTurnUserVideo } =
    useContext(ChatContext);

  const handleScroll = () => {
    const boxChat = chatboxRef.current;
    const scrollTop = boxChat.scrollTop;

    if (scrollTop === 0) {
      setPage((prevData) => prevData + 1);
    }
  };

  const handleClickOutside = (event) => {
    const idSvg = document.querySelector('#svg_emoiji');
    const idText = document.querySelector('#text_input');
    const idDeleteConversation = document.querySelector('#delete_conversation');

    if (
      emoijiRef?.current &&
      !emoijiRef?.current.contains(event.target) &&
      !idSvg?.contains(event.target) &&
      !idText?.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    } else if (!idDeleteConversation?.contains(event.target)) {
      setTooltipSetting(false);
    }
  };

  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const boxChat = chatboxRef.current;
    boxChat.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClickOutside);
    scrollToBottom();
    return () => {
      boxChat.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClickOutside);
      chatStore?.setSelectedChat(null);
    };
  }, []);

  useEffect(() => {
    const boxChat = chatboxRef.current;
    const scrollTop = boxChat.scrollTop;

    if (message && scrollTop > 0 && !firstRender.current) {
      scrollToBottom();
    } else if (firstRender.current) {
      firstRender.current = false;
      scrollToBottom();
    }
  }, [message]);

  useEffect(() => {
    setTooltipSetting(false);
    return () => {
      setSnippet(false);
      setImageFile('');
      setCurrentContent('');
      firstRender.current = true;
    };
  }, [chat]);

  useEffect(() => {
    if (imageFile === 'err') {
      uiStore?.setLoading(false);
      setImageFile('');
    } else if (imageFile !== '') {
      uiStore?.setLoading(false);
      setCurrentContent(imageFile);
    }
  }, [imageFile]);

  const sendMessage = (message: string) => {
    if (currentContent.trim() !== '') {
      const receiveMessageDTO = {
        data: {
          message: snippets ? message + codeSnippets : message,
        },
        TargetId: chat?.partnerDTO[0]?.id,
        userId: account.id,
        conversationId: chat?.conversationInfor.id,
        groupChatName: isGroup ? chat?.conversationInfor.chatName : null,
        groupChat: chat?.conversationInfor.isGroupChat,
        timeAt: new Date().toISOString(),
      };
      const stateMessage = {
        data: {
          message: snippets ? message + codeSnippets : message,
        },
        username: account.username,
        userId: account.id,
        conversationId: chat?.conversationInfor.id,
      };

      const lastMessage = {
        senderId: account.id,
        userName: account.username,
        message: message,
        timeAt: new Date().toISOString(),
      };
      setSnippet(false);
      chatStore?.updateLastMessage(chat?.conversationInfor.id, lastMessage);
      socket.emit('sendMessage', receiveMessageDTO);
      setMessage((prevMessages) => [...prevMessages, stateMessage]);
      const inputElement = document.getElementById('text_input');
      setShowEmojiPicker(false);
      setCurrentContent('');
      setImageFile('');
      inputElement.focus();
    }
  };

  const handleCallVideo = () => {
    if (isFriend) {
      const receiveMessageDTO = {
        data: {
          message: 'video',
        },
        targetName: chat.partnerDTO[0].username,
        targetId: chat?.partnerDTO[0]?.id,
        timeAt: new Date().toISOString(),
        userId: account.id,
        username: account.username,
        conversationId: chat.conversationInfor.id,
      };
      socket.emit('1V1CommunicateVideo', receiveMessageDTO);
      setCallUser(receiveMessageDTO);
      setOpenVideoCall(true);
    } else {
      ToastError('Become Friend to Call');
    }
  };

  const handleCall = () => {
    if (isFriend) {
      const receiveMessageDTO = {
        data: {
          message: 'call',
        },
        targetName: chat.partnerDTO[0].username,
        targetId: chat?.partnerDTO[0]?.id,
        timeAt: new Date().toISOString(),
        userId: account.id,
        username: account.username,
        conversationId: chat.conversationInfor.id,
      };
      socket.emit('1V1CommunicateVideo', receiveMessageDTO);
      setCallUser(receiveMessageDTO);
      setOpenVideoCall(true);
      setTurnMyVideo(false);
      setTurnUserVideo(false);
    } else {
      ToastError('Be Friend to Call');
    }
  };

  const addEmoji = (emoji: any) => {
    setCurrentContent(currentContent + emoji.native);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleLinkClick = () => {
    fileInputRef.current.click();
  };

  const handleSnippetCode = () => {
    setSnippet(!snippets);
  };

  const handleOpenTooltip = (data: IMessage) => {
    if (isGroup) {
      setTopicId(chat?.conversationInfor?.topicChildren.id);
      setDataTooltip(data);
      setOpenAccessTooltip(true);
    }
  };

  const commonMessage = {
    data: {
      message: `${optionCode}`,
    },
    TargetId: chat?.partnerDTO[0]?.id,
    userId: account?.id,
    conversationId: chat?.conversationInfor.id,
    groupChatName: isGroup ? chat?.conversationInfor.chatName : null,
    groupChat: chat?.conversationInfor.isGroupChat,
  };

  const deleteConversation = () => {
    const receiveMessageDTO = {
      ...commonMessage,
      data: {
        message: `${optionCode},DeleteConversation,`,
      },
    };
    socket.emit('sendMessage', receiveMessageDTO);
    deleteDataAPI(`/conversation?cid=${chat?.conversationInfor.id}`, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess(
          `You have just deleted ${isGroup ? chat?.conversationInfor.chatName : partnerUser.username} Conversation`,
        );
        chatStore?.setSelectedChat(null);
        const newChats = chatStore?.chats.filter((item) => item.conversationInfor.id !== chat?.conversationInfor.id);
        chatStore?.setChats(newChats);
        setOpenConFirmGroup(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const partnerUser = chat?.partnerDTO.find((item) => item.id !== account.id);
  const imageUser = (message: IMessage) => {
    const image = chat?.partnerDTO.filter((item) => item.id === message.userId).map((item) => item.image);
    return image.toString();
  };

  const isFriend =
    chat?.partnerDTO?.length > 0 &&
    friendStore?.friends?.some(
      (item) => (item.friendId === partnerUser?.id || item.userid === partnerUser?.id) && item.accept,
    );

  const notifiGroup = (message: string) => {
    const result = message.split(',')[2].trim() === account.username ? 'You' : message.split(',')[2].trim();
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

  const isRemove = message[message?.length - 1]?.data.message.includes(`option_1410#$#,Delete, ${account.username}`);

  const isDisable = isRemove || currentContent === '';

  const isActive = chat?.partnerDTO.some((item) => item.active);

  return (
    <Box className="chatbox_container">
      <Box className="chatbox_header">
        {isSelecedChat && isMember === 'true' && (
          <>
            <Box className="title_name">
              <span
                className={`${!isGroup && 'link'} active_avatar`}
                onClick={() => !isGroup && navigate(`/personal-profile/${partnerUser?.id}`)}
              >
                <Avatar
                  src={isGroup ? chat?.conversationInfor.avtGroupImg : partnerUser?.image}
                  alt="avt"
                  className="avatar_header"
                />
                {isActive ? (
                  <FiberManualRecordTwoTone className="online" />
                ) : (
                  <FiberManualRecordTwoTone className="offline" />
                )}
              </span>

              <span className="name">
                <Typography
                  className={`${!isGroup && 'link'} name_chat`}
                  onClick={() => !isGroup && navigate(`/personal-profile/${partnerUser?.id}`)}
                >
                  {isGroup ? chat?.conversationInfor.chatName : partnerUser?.username}
                </Typography>
                <Typography className="active">{isActive ? 'Online' : 'Offline'}</Typography>
              </span>
              <Typography className="topic_name">
                {isGroup && `(${chat?.conversationInfor?.topicChildren.topicChildrenName})`}
              </Typography>
            </Box>

            <Box className="header_option">
              {!isGroup && (
                <>
                  <BiPhoneCall onClick={handleCall} className={!isFriend && 'disable_call'} />
                  <BsCameraVideo onClick={handleCallVideo} className={!isFriend && 'disable_call'} />
                  <BiDotsVerticalRounded onClick={() => setTooltipSetting(!tooltipSetting)} id="delete_conversation" />
                </>
              )}
            </Box>
            {tooltipSetting && (
              <Box className="tooltip_setting" id="delete_conversation">
                <Typography onClick={() => setOpenConFirmGroup(true)}>
                  <MdDelete /> Delete Conversation
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
      <Box className="chat_box" ref={chatboxRef}>
        {showEmojiPicker && (
          <span ref={emoijiRef}>
            <Picker data={data} onEmojiSelect={addEmoji} className="emoiji_box" />
          </span>
        )}
        {isSelecedChat && isMember === 'true' ? (
          <Box className="list_message">
            {isLoadMessage && (
              <Box className="load_message">
                <RiLoader2Line />
              </Box>
            )}
            {message.length > 0 &&
              message.map((item: IMessage, index) => (
                <Box
                  id={item.userId === account.id ? 'you' : 'other'}
                  className={`${item.data.message.includes('option_1410#$#') ? 'message_notifi' : 'message'}`}
                  key={index}
                >
                  {item.userId !== account.id && !item.data.message.includes('option_1410#$#') && (
                    <span className="active_avatar">
                      <Avatar
                        src={imageUser(item)}
                        alt="avatar"
                        className={isGroup && 'avatar'}
                        onClick={() => handleOpenTooltip(item)}
                      />
                      {item.userId === partnerUser?.id && partnerUser?.active ? (
                        <FiberManualRecordTwoTone className="online" />
                      ) : (
                        <FiberManualRecordTwoTone className="offline" />
                      )}
                    </span>
                  )}
                  <Box className="message_box">
                    {isImage.some((ext) => item.data.message.endsWith(ext) && item.data.message?.length > 90) ? (
                      <ReactImageFallback
                        src={item.data.message}
                        fallbackImage={'/path/to/default/image'}
                        initialImage={'/path/to/initial/image'}
                        alt="message image"
                        className="image-message"
                        onClick={() => setZoomImage(item.data.message)}
                      />
                    ) : item.data.message.includes('snippet_syntax1410#$') ? (
                      <>
                        <SyntaxHighlighter language="javascript" style={atomOneDark}>
                          {`${item.data.message.split('%%')[0]}`}
                        </SyntaxHighlighter>
                      </>
                    ) : (
                      <>
                        {item.data.message.includes('isCallCA01410') ? (
                          <Typography className="message_content">
                            {item.data.message.includes('MA01410') ? (
                              <>
                                <HiPhoneMissedCall className="missing_call" /> Missing Call
                              </>
                            ) : (
                              <>
                                <FcCallback /> in {item.data.message.split(',')[1].trim()}
                              </>
                            )}
                          </Typography>
                        ) : item.data.message.includes('option_1410#$#') ? (
                          <Typography>{notifiGroup(item.data.message)}</Typography>
                        ) : (
                          <Typography className="message_content">{item.data.message.trim()}</Typography>
                        )}
                      </>
                    )}

                    <Typography className="messge_username">
                      {!item.data.message.includes('option_1410#$#') && item.username}
                    </Typography>
                  </Box>

                  {item.userId === account?.id && !item.data.message.includes('option_1410#$#') && (
                    <Avatar src={account?.url_img} alt="avatar" />
                  )}
                </Box>
              ))}
          </Box>
        ) : (
          <Box className="no_data_selected">
            <span className="img_no_select" />

            <Typography>No chats selected</Typography>
          </Box>
        )}
      </Box>

      <Box className="chatbox_footer">
        {isSelecedChat && isMember === 'true' && (
          <>
            <FaImage onClick={handleLinkClick} />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: ' none' }}
              onChange={(e) => {
                handleImageUpload(e.target.files, setImageFile, false);
                uiStore?.setLoading(true);
              }}
            />
            {imageFile !== '' && (
              <span className="image-name">
                <img src={imageFile} alt="img" />
                <span>
                  <IoIosCloseCircle
                    onClick={() => {
                      setImageFile('');
                      setCurrentContent('');
                    }}
                  />
                </span>
              </span>
            )}
            <RiEmotionLaughLine onClick={toggleEmojiPicker} id="svg_emoiji" />
            <BsCodeSlash title="Code Snippet" onClick={handleSnippetCode} className={snippets && 'snippet'} />
            <TextField
              id="text_input"
              required
              multiline
              disabled={imageFile !== '' || isRemove}
              value={imageFile === '' ? currentContent : 'Send Image First...'}
              placeholder={snippets ? 'Write your note here...' : 'Type your message...'}
              className="chatbox_input"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                setCurrentContent(e.target.value);
              }}
              onKeyDown={(event) => {
                if (event.keyCode === 13 && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage(currentContent);
                }
              }}
            />
            <GrSend
              className={`send_icon ${isDisable && 'disable_chat'}`}
              onClick={() => sendMessage(currentContent)}
            />
          </>
        )}
      </Box>
      {openAccessTooltip && (
        <AccessTooltip
          open={openAccessTooltip}
          onClose={() => setOpenAccessTooltip(false)}
          dataTooltip={dataTooltip}
          topicId={topicId}
        />
      )}
      {openConfirmGroup && (
        <DialogCommon
          open={openConfirmGroup}
          onClose={() => setOpenConFirmGroup(false)}
          onConfirm={deleteConversation}
          content={contentGroup}
        />
      )}
      {zoomImage !== '' && <ImageZoom open={zoomImage !== ''} onClose={() => setZoomImage('')} image={zoomImage} />}
    </Box>
  );
});

export default memo(ChatBox);
