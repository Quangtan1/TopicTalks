import { FiberManualRecordTwoTone } from '@mui/icons-material';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FcCollapse, FcExpand, FcOk, FcTimeline } from 'react-icons/fc';
import { MdDone, MdOutlineAccountCircle, MdOutlineCancel } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import SelectTopicMessage from 'src/components/dialogs/SelectTopicMessage';
import ChatContext from 'src/context/ChatContext';
import accountStore from 'src/store/accountStore';
import chatStore from 'src/store/chatStore';
import { IPartnerDTO, ListMesage } from 'src/types/chat.type';
import { TopicChild } from 'src/types/topic.type';
import { createAxios, deleteDataAPI, postDataAPI, putDataAPI } from 'src/utils';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';

interface ChatProps {
  chat: ListMesage;
}
const ConversationSetting = observer((props: ChatProps) => {
  const [collapse, setCollapse] = useState<number[]>([1, 2]);
  const [partnerData, setPartnerData] = useState<IPartnerDTO>(null);
  const [openConfirm, setOpenConFirm] = useState<boolean>(false);
  const [openConfirmGroup, setOpenConFirmGroup] = useState<boolean>(false);
  const [edit, setEdit] = useState<number>(null);
  const [renameGroup, setRenameGroup] = useState<string>('');
  const [openUpdateTopic, setOpenUpdateTopic] = useState<boolean>(false);
  const [statusDelete, setStatusDelete] = useState<string>('');
  const [openLeave, setOpenLeave] = useState<boolean>(false);
  const { chat } = props;
  const optionCode = 'option_1410#$#';

  const { socket, setMessage } = useContext(ChatContext);

  const navigate = useNavigate();
  const isGroup = chat?.conversationInfor.isGroupChat;
  const isAdmin = chat?.conversationInfor.adminId === accountStore?.account.id;
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleCollapse = (id: number) => {
    if (collapse.includes(id)) {
      const newCollap = collapse.filter((idItem) => idItem !== id);
      setCollapse(newCollap);
    } else {
      setCollapse([...collapse, id]);
    }
  };

  const commonMessage = {
    data: {
      message: `${optionCode}`,
    },
    TargetId: chat?.partnerDTO[0]?.id,
    userId: account.id,
    conversationId: chat?.conversationInfor.id,
    groupChatName: isGroup ? chat?.conversationInfor.chatName : null,
    groupChat: chat?.conversationInfor.isGroupChat,
  };

  const memberDTO = chat?.partnerDTO.filter((item) => item.member);
  const memberWating = chat?.partnerDTO.filter((item) => !item.member);

  const saveNotifi = (userId: number, content: string) => {
    const dataRequest = {
      conversationId: chat?.conversationInfor.id,
      userId: userId,
      messageNoti: content,
      partnerId: account.id,
      postId: null,
    };
    postDataAPI(`/notification/pushNoti`, dataRequest, account.access_token, axiosJWT)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAprrove = (member: IPartnerDTO) => {
    const approveData = {
      userInSessionId: account.id,
      conversationId: chat?.conversationInfor.id,
      memberId: member.id,
    };

    const receiveMessageDTO = {
      ...commonMessage,
      data: {
        message: `${optionCode},Approve, ${member.username}`,
      },
    };

    const lastMessage = {
      senderId: account.id,
      userName: account.username,
      message: receiveMessageDTO.data.message,
      timeAt: new Date().toISOString(),
    };
    chatStore?.updateLastMessage(chat?.conversationInfor.id, lastMessage);
    saveNotifi(member.id, receiveMessageDTO.data.message);
    socket.emit('sendMessage', receiveMessageDTO);
    setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
    putDataAPI(`/participant/approve-member`, approveData, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess(`You have just approved ${member.username}`);
        const newData = res.data.data.partnerDTO?.filter((item) => item.id !== account.id);
        chatStore?.setSelectedChat({ ...chat, partnerDTO: newData });
        chatStore?.updateChat(chat?.conversationInfor.id, chatStore?.selectedChat);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReject = (member: IPartnerDTO, status: string) => {
    const memberId = member?.id;
    const receiveMessageDTO = {
      ...commonMessage,
      data: {
        message: `${optionCode},${status}, ${member.username}`,
      },
    };

    const lastMessage = {
      senderId: account.id,
      userName: account.username,
      message: receiveMessageDTO.data.message,
      timeAt: new Date().toISOString(),
    };
    chatStore?.updateLastMessage(chat?.conversationInfor.id, lastMessage);
    saveNotifi(member.id, receiveMessageDTO.data.message);
    socket.emit('sendMessage', receiveMessageDTO);
    setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
    deleteDataAPI(
      `/participant/remove-member?aid=${account.id}&uid=${memberId}&cid=${chat?.conversationInfor.id}`,
      account.access_token,
      axiosJWT,
    )
      .then((res) => {
        ToastSuccess(`You have just deleted ${partnerData?.username}`);
        const newPartner = chat?.partnerDTO.filter((item) => item.id !== memberId);
        chatStore?.setSelectedChat({ ...chat, partnerDTO: newPartner });
        chatStore?.updateChat(chat?.conversationInfor.id, chatStore?.selectedChat);
        setOpenConFirm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const leaveGroup = (status: string) => {
    const receiveMessageDTO = {
      ...commonMessage,
      data: {
        message: `${optionCode},${status}, ${account.username}`,
      },
    };
    socket.emit('sendMessage', receiveMessageDTO);
    setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
    deleteDataAPI(
      `/participant/remove-member?aid=${chat.conversationInfor.adminId}&uid=${account.id}&cid=${chat?.conversationInfor.id}`,
      account.access_token,
      axiosJWT,
    )
      .then((res) => {
        ToastSuccess(`Leave Group Successfully`);
        const newChats = chatStore?.chats.filter((item) => item.conversationInfor.id !== chat.conversationInfor.id);
        chatStore?.setSelectedChat(null);
        chatStore?.setChats(newChats);
        setOpenLeave(false);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const updateGroupName = () => {
    if (renameGroup !== chat?.conversationInfor.chatName) {
      const dataRequest = {
        chatName: renameGroup,
        topicChildrenId: chat?.conversationInfor.topicChildren.id,
        adminId: account.id,
      };
      const receiveMessageDTO = {
        ...commonMessage,
        data: {
          message: `${optionCode},UpdateGroupName,${chat?.conversationInfor.chatName} to ${renameGroup}`,
        },
      };

      const lastMessage = {
        senderId: account.id,
        userName: account.username,
        message: receiveMessageDTO.data.message,
        timeAt: new Date().toISOString(),
      };
      chatStore?.updateLastMessage(chat?.conversationInfor.id, lastMessage);
      socket.emit('sendMessage', receiveMessageDTO);
      setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
      putDataAPI(`/conversation/rename?cid=${chat?.conversationInfor.id}`, dataRequest, account.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess(`You have just renamed ${chat?.conversationInfor.chatName} to ${renameGroup} `);
          chatStore?.setSelectedChat({
            ...chat,
            conversationInfor: {
              ...chat.conversationInfor,
              chatName: res.data.data.chatName,
            },
          });
          chatStore?.updateChat(chat?.conversationInfor.id, chatStore?.selectedChat);
          setEdit(null);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ToastError(`Please use different names with old name`);
    }
  };

  const updateTopicName = (topic: TopicChild) => {
    const topicName = chat?.conversationInfor.topicChildren.topicChildrenName;
    if (chat?.conversationInfor.topicChildren.id !== topic.id) {
      const dataRequest = {
        newTopicId: topic.id,
        userIdUpdate: account.id,
      };
      const receiveMessageDTO = {
        ...commonMessage,
        data: {
          message: `${optionCode},UpdateTopic,${topicName} to ${topic.topicChildrenName}`,
        },
      };

      socket.emit('sendMessage', receiveMessageDTO);
      setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
      putDataAPI(`/conversation/${chat?.conversationInfor.id}`, dataRequest, account.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess(`You have just renamed ${topicName} to ${topic.topicChildrenName} `);
          chatStore?.setSelectedChat({
            ...chat,
            conversationInfor: {
              ...chat.conversationInfor,
              topicChildren: {
                ...chat.conversationInfor,
                id: topic.id,
                topicChildrenName: topic.topicChildrenName,
              },
            },
          });
          chatStore?.updateChat(chat?.conversationInfor.id, chatStore?.selectedChat);
          setOpenUpdateTopic(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ToastError(`Please use different topic names with old name`);
    }
  };

  const partnerUser = chat?.partnerDTO.find((item) => item.id !== account.id);

  const handleNavigate = () => {
    const id = chat?.partnerDTO.filter((item) => item.id !== account.id).map((item) => item.id);
    navigate(`/personal-profile/${id}`);
  };

  const handleConfirm = (memberDTO: IPartnerDTO, status: string) => {
    setPartnerData(memberDTO);
    setStatusDelete(status);
    setOpenConFirm(true);
  };

  const openConfirmLeave = () => {
    setOpenLeave(true);
  };

  const clickEditName = () => {
    setEdit(1);
    setRenameGroup(chat?.conversationInfor.chatName);
  };
  const clickEditTopic = () => {
    setOpenUpdateTopic(true);
  };

  const isActive = chat?.partnerDTO.some((item) => item.active);

  const content = `Do you want to delete ${partnerData?.username}`;
  const contenGroup = `Do you want to delete this conversation`;

  return (
    <Box className="conver_setting_container">
      <Box className="container_setting">
        <Box className="avatar_setting">
          <span className="active_avatar_setting">
            <Avatar
              src={isGroup ? chat?.conversationInfor.avtGroupImg : partnerUser?.image}
              alt="avt"
              className="avatar"
            />
            {isActive ? (
              <FiberManualRecordTwoTone className="online" />
            ) : (
              <FiberManualRecordTwoTone className="offline" />
            )}
          </span>

          {edit === 1 ? (
            <span className="edit_name">
              <TextField value={renameGroup} onChange={(e) => setRenameGroup(e.target.value)} />
              <MdDone className={renameGroup === '' && 'disable_done'} onClick={updateGroupName} />
              <MdOutlineCancel onClick={() => setEdit(null)} />
            </span>
          ) : (
            <Typography className="chat_name">
              {isGroup ? chat?.conversationInfor?.chatName : partnerUser?.username}
              {isAdmin && isGroup && <AiOutlineEdit onClick={clickEditName} />}
            </Typography>
          )}

          {!isGroup && (
            <Typography className="personal_profile" onClick={handleNavigate}>
              <MdOutlineAccountCircle /> Personal Profile
            </Typography>
          )}
        </Box>
        {/* <Box className="topic_setting">
          <Typography>Topic:</Typography>

          <Typography>{chat?.conversationInfor?.topicChildren.topicChildrenName}</Typography>
          {(isAdmin || !isGroup) && <AiOutlineEdit onClick={clickEditTopic} />}
        </Box> */}
        {isGroup && (
          <Box className="member_setting">
            <Box className="title_member_setting">
              <Typography>
                <FcTimeline />
                Members
              </Typography>
              <span onClick={() => handleCollapse(1)}>{collapse.includes(1) ? <FcExpand /> : <FcCollapse />}</span>
            </Box>

            {collapse.includes(1) &&
              memberDTO.map((item) => (
                <Box className="memeber_item" key={item.id}>
                  <Box className="infor_member">
                    <span className="active_avatar" onClick={() => navigate(`/personal-profile/${item.id}`)}>
                      <Avatar src={item.image} alt="avt" className="member_avt" />
                      {item.id === partnerUser?.id && partnerUser?.active ? (
                        <FiberManualRecordTwoTone className="online" />
                      ) : (
                        <FiberManualRecordTwoTone className="offline" />
                      )}
                    </span>

                    <Typography onClick={() => navigate(`/personal-profile/${item.id}`)}>
                      {item.username}
                      <strong>{chat?.conversationInfor.adminId === item.id && '(Admin)'}</strong>
                    </Typography>
                  </Box>
                  {isAdmin && item.id !== account.id && (
                    <TiDeleteOutline className="svg_item" onClick={() => handleConfirm(item, 'Remove')} />
                  )}
                </Box>
              ))}

            {isAdmin && (
              <Box className="title_member_setting">
                <Typography>
                  <FcTimeline />
                  Members Waiting
                </Typography>
                <span onClick={() => handleCollapse(2)}>{collapse.includes(2) ? <FcExpand /> : <FcCollapse />}</span>
              </Box>
            )}

            {collapse.includes(2) &&
              isAdmin &&
              memberWating.map((item) => (
                <Box className="memeber_item" key={item.id}>
                  <Box className="infor_member">
                    <Avatar src={item.image} alt="avt" className="member_avt" />
                    <Typography>
                      {item.username}
                      <strong>{chat?.conversationInfor.adminId === item.id && '(Admin)'}</strong>
                    </Typography>
                  </Box>

                  {isAdmin && (
                    <Box className="option_member">
                      <FcOk onClick={() => handleAprrove(item)} />
                      <TiDeleteOutline className="svg_item" onClick={() => handleConfirm(item, 'Reject')} />
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        )}
      </Box>
      {isAdmin || !isGroup ? (
        <Button className="button_delete" onClick={() => setOpenConFirmGroup(true)}>
          Delete Conversation
        </Button>
      ) : (
        <Button className="button_delete" onClick={openConfirmLeave}>
          Leave Conversation
        </Button>
      )}

      {openConfirm && (
        <DialogCommon
          open={openConfirm}
          onClose={() => setOpenConFirm(false)}
          onConfirm={() => handleReject(partnerData, statusDelete)}
          content={content}
        />
      )}
      {openLeave && (
        <DialogCommon
          open={openLeave}
          onClose={() => setOpenLeave(false)}
          onConfirm={() => leaveGroup('Leave')}
          content="Do you want to leave this Group"
        />
      )}
      {openConfirmGroup && (
        <DialogCommon
          open={openConfirmGroup}
          onClose={() => setOpenConFirmGroup(false)}
          onConfirm={deleteConversation}
          content={contenGroup}
        />
      )}
      {openUpdateTopic && (
        <SelectTopicMessage
          open={openUpdateTopic}
          onClose={() => setOpenUpdateTopic(false)}
          onConfirm={updateTopicName}
        />
      )}
    </Box>
  );
});

export default ConversationSetting;
