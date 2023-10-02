import React, { useEffect, useState, useRef } from 'react';
import ChatContext from './ChatContext';
import { IMessage } from 'src/types';
import { observer } from 'mobx-react';
import { io } from 'socket.io-client';
import accountStore from 'src/store/accountStore';
import chatStore from 'src/store/chatStore';
import { ICallData } from 'src/types/chat.type';
import VideoCall from 'src/components/layouts/chats/videocall/VideoCall';

interface ChatProviderProps {
  children: React.ReactNode;
}
var socket;
const ChatProvider: React.FC<ChatProviderProps> = observer((props) => {
  const [message, setMessage] = useState<IMessage[]>([]);
  const account = accountStore?.account;
  const chat = chatStore?.selectedChat;

  //call
  const [openVideoCall, setOpenVideoCall] = useState<boolean>(false);
  const [callUser, setCallUser] = useState<ICallData>(null);
  const [receiveCallUser, setReceiveCallUser] = useState<ICallData>(null);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const codeMode = 'CA01410';

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
      socket = io(`http://localhost:8085?uid=${account.id}`);
      socket.on('connect', () => {
        console.log('Connect Socket.IO');
      });
      socket.on('sendMessage', handleReceiveMessage);
      socket.on('1V1CommunicateVideo', (data: ICallData) => {
        if (data.data.message === 'reject') {
          setCallUser(null);
          setReceiveCallUser(null);
          setIsAccepted(false);
          setOpenVideoCall(false);
        } else if (data.data.message === 'accept') {
          setIsAccepted(true);
          setReceiveCallUser(data);
        } else {
          setReceiveCallUser(data);
          setOpenVideoCall(true);
        }
      });
      return () => {
        socket.on('disconnect', () => {
          console.log('Disconnect Socket.IO');
        });
        socket.disconnect();
      };
    }
  }, [chat, account]);

  const handleReceiveMessage = (receiveMessageDTO: IMessage) => {
    if (chat?.conversationInfor.id === receiveMessageDTO.conversationId) {
      setMessage((prevMessages) => [...prevMessages, receiveMessageDTO]);
    } else {
      console.log('notification');
    }
  };

  const handleLeaveCall = () => {
    setCallUser(null);
    setReceiveCallUser(null);
    socket.emit('1V1CommunicateVideo', receiveMessageDTO);
    setIsAccepted(false);
    setOpenVideoCall(false);
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

  const saveCall = () => {
    const currentDateTime: Date = new Date();
    const previousDateTime: Date = new Date(receiveMessageDTO.timeAt);
    const timeDifference: number = currentDateTime.getTime() - previousDateTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(timeDifference / 1000 / 60);
    const receiveMessag = {
      data: {
        message: `isCall${codeMode}, ${seconds > 60 ? `${minutes} minutes` : `${seconds} seconds`}`,
      },
      TargetId: targetIdCustom,
      userId: account.id,
      conversationId: receiveCallUser?.conversationId || callUser?.conversationId,
    };
    const stateMessage = {
      data: {
        message: `isCall${codeMode}, ${seconds > 60 ? `${minutes} minutes` : `${seconds} seconds`}`,
      },
      username: account.username,
      userId: account.id,
      timeAt: new Date().toISOString(),
      conversationId: receiveCallUser?.conversationId || callUser?.conversationId,
    };
    socket.emit('sendMessage', receiveMessag);
    setMessage((prevMessages: IMessage[]) => [...prevMessages, stateMessage]);
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
          />
        )}
      </ChatContext.Provider>
    </div>
  );
});

export default ChatProvider;
