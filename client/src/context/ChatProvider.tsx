import React, { useEffect, useState } from 'react';
import ChatContext from './ChatContext';
import { IMessage, INotifiSystem } from 'src/types';
import { observer } from 'mobx-react';
import { io } from 'socket.io-client';
import accountStore from 'src/store/accountStore';
import chatStore from 'src/store/chatStore';
import { ICallData, ListMesage } from 'src/types/chat.type';
import VideoCall from 'src/components/layouts/chats/videocall/VideoCall';
import { ToastSuccess } from 'src/utils/toastOptions';
import { createAxios, postDataAPI } from 'src/utils';

interface ChatProviderProps {
  children: React.ReactNode;
}
var socket;
const ChatProvider: React.FC<ChatProviderProps> = observer((props) => {
  const [message, setMessage] = useState<IMessage[]>([]);
  const account = accountStore?.account;
  const chat = chatStore?.selectedChat;

  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };
  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  //notification
  const [notification, setNotification] = useState<IMessage[]>([]);
  const [notifiSystem, setNotifiSystem] = useState<INotifiSystem[]>([]);

  //call
  const [openVideoCall, setOpenVideoCall] = useState<boolean>(false);
  const [callUser, setCallUser] = useState<ICallData>(null);
  const [receiveCallUser, setReceiveCallUser] = useState<ICallData>(null);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [turnMyVideo, setTurnMyVideo] = useState<boolean>(true);
  const [turnUserVideo, setTurnUserVideo] = useState<boolean>(true);
  const [isRandoming, setIsRandoming] = useState<boolean>(false);
  const [openRandom, setOpenRandom] = useState<boolean>(false);
  const codeAccept = 'CA01410';
  const codeMissing = 'MA01410';

  const targetNameCustom =
    account?.username !== receiveCallUser?.username && receiveCallUser?.username !== undefined
      ? receiveCallUser?.username
      : callUser?.targetName;
  const targetIdCustom =
    account?.id !== receiveCallUser?.userId && receiveCallUser?.userId !== undefined
      ? receiveCallUser?.userId
      : callUser?.targetId;

  const receiveMessageDTO = {
    data: {
      message: 'reject',
    },
    targetName: targetNameCustom,
    targetId: targetIdCustom,
    timeAt: new Date().toISOString(),
    userId: account?.id,
    username: account?.username,
    conversationId: receiveCallUser?.conversationId || callUser?.conversationId,
  };
  useEffect(() => {
    if (account !== null) {
      socket = io(`http://192.168.110.14:8086?uid=${account.id}`);
      socket.on('sendMessage', handleReceiveMessage);
      socket.on('1V1CommunicateVideo', (data: ICallData) => {
        const statusCall = data.data.message;
        if (statusCall === 'reject') {
          setCallUser(null);
          setReceiveCallUser(null);
          setIsAccepted(false);
          setOpenVideoCall(false);
          setTurnMyVideo(true);
          setTurnUserVideo(true);
        } else if (statusCall === 'accept') {
          setIsAccepted(true);
          setReceiveCallUser(data);
        } else if (statusCall === 'call') {
          setReceiveCallUser(data);
          setOpenVideoCall(true);
          setTurnMyVideo(false);
          setTurnUserVideo(false);
        } else if (statusCall === 'turnVideo') {
          setTurnUserVideo((prevTurnUserVideo) => !prevTurnUserVideo);
        } else {
          setReceiveCallUser(data);
          setOpenVideoCall(true);
        }
      });
      socket.on('partiAccess', (data: ListMesage) => {
        setTimeout(() => {
          const result = chatStore?.chats.some((item) => item.conversationInfor.id === data?.conversationInfor.id);
          setIsRandoming(false);
          chatStore?.setSelectedChat(data);
          ToastSuccess('You access random chat successfully!');
          if (chatStore?.chats?.length > 0) {
            if (!result) {
              chatStore?.setChats([data, ...chatStore?.chats]);
            }
          } else {
            chatStore?.setChats([data]);
          }
          setOpenRandom(false);
        }, 2000);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [chat, account]);

  useEffect(() => {
    return () => {
      setNotification([]);
    };
  }, [account]);

  const handleReceiveMessage = (receiveMessageDTO: IMessage) => {
    if (chat?.conversationInfor.id === receiveMessageDTO.conversationId) {
      setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
      const lastMessage = {
        senderId: receiveMessageDTO.userId,
        userName: receiveMessageDTO.username,
        message: receiveMessageDTO.data.message,
        timeAt: receiveMessageDTO.timeAt,
      };
      chatStore?.chats && chatStore?.updateLastMessage(receiveMessageDTO.conversationId, lastMessage);
    } else {
      const lastMessage = {
        senderId: receiveMessageDTO.userId,
        userName: receiveMessageDTO.username,
        message: receiveMessageDTO.data.message,

        timeAt: receiveMessageDTO.timeAt,
      };
      chatStore?.chats && chatStore?.updateLastMessage(receiveMessageDTO.conversationId, lastMessage);
      setNotification((prevNotification) => {
        const isOption = receiveMessageDTO.data.message.includes('option_1410#$#');
        const index = prevNotification.findIndex((item) => item.conversationId === receiveMessageDTO.conversationId);
        const indexOption = prevNotification.findIndex((item) => item.data.message.includes('option_1410#$#'));
        // saveNotifi(receiveMessageDTO);
        const updatedNotification = [...prevNotification];
        if (index !== -1 && !isOption && index !== indexOption) {
          updatedNotification[index] = receiveMessageDTO;
        } else if (isOption) {
          updatedNotification.unshift(receiveMessageDTO);
        } else {
          updatedNotification.unshift(receiveMessageDTO);
        }
        return updatedNotification;
      });
    }
  };

  const handleLeaveCall = () => {
    setCallUser(null);
    setReceiveCallUser(null);
    socket.emit('1V1CommunicateVideo', receiveMessageDTO);
    setIsAccepted(false);
    setOpenVideoCall(false);
    setTurnMyVideo(true);
    setTurnUserVideo(true);
  };

  const acceptCall = () => {
    const acceptData = {
      ...receiveMessageDTO,
      data: {
        message: 'accept',
      },
    };
    setIsAccepted(true);
    socket.emit('1V1CommunicateVideo', acceptData);
  };

  const handleTurnVideo = () => {
    const turnVideoData = {
      ...receiveMessageDTO,
      data: {
        message: 'turnVideo',
      },
    };
    setTurnMyVideo(!turnMyVideo);
    socket.emit('1V1CommunicateVideo', turnVideoData);
  };

  const saveCall = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const receiveMessag = {
      data: {
        message: `isCall${codeAccept} ${!isAccepted && codeMissing},  ${
          seconds > 60 ? `${minutes} minutes` : `${seconds} seconds`
        }`,
      },
      TargetId: targetIdCustom,
      userId: account.id,
      conversationId: receiveCallUser?.conversationId || callUser?.conversationId,
    };
    const stateMessage = {
      data: {
        message: `isCall${codeAccept} ${!isAccepted && codeMissing}, ${
          seconds > 60 ? `${minutes} minutes` : `${seconds} seconds`
        }`,
      },
      username: account.username,
      userId: account.id,
      timeAt: new Date().toISOString(),
      conversationId: receiveCallUser?.conversationId || callUser?.conversationId,
      groupChatName: null,
      groupChat: true,
    };

    const lastMessage = {
      senderId: stateMessage.userId,
      userName: stateMessage.username,
      message: stateMessage.data.message,
      timeAt: stateMessage.timeAt,
    };
    chatStore?.chats && chatStore?.updateLastMessage(stateMessage.conversationId, lastMessage);
    socket.emit('sendMessage', receiveMessag);
    if (stateMessage?.conversationId === chat?.conversationInfor?.id) {
      setMessage((prevMessages: IMessage[]) => [...prevMessages, stateMessage]);
    }
  };

  return (
    <div>
      <ChatContext.Provider
        value={{
          message,
          setMessage,
          socket,
          setCallUser,
          setOpenVideoCall,
          notification,
          setNotification,
          setTurnMyVideo,
          setTurnUserVideo,
          isRandoming,
          setIsRandoming,
          openRandom,
          setOpenRandom,
          notifiSystem,
          setNotifiSystem,
        }}
      >
        {props.children}
        {openVideoCall && (
          <VideoCall
            open={openVideoCall}
            onLeaveCall={handleLeaveCall}
            callUser={callUser}
            receiveCallUser={receiveCallUser}
            acceptCall={acceptCall}
            isAccepted={isAccepted}
            saveCall={saveCall}
            handleTurnVideo={handleTurnVideo}
            turnMyVideo={turnMyVideo}
            turnUserVideo={turnUserVideo}
          />
        )}
      </ChatContext.Provider>
    </div>
  );
});

export default ChatProvider;
