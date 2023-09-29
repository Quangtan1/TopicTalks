import React, { useState } from 'react';
import ChatContext from './ChatContext';
import { IMessage } from 'src/types';

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = (props) => {
  const [message, setMessage] = useState<IMessage[]>([]);

  return (
    <div>
      <ChatContext.Provider
        value={{
          message,
          setMessage,
        }}
      >
        {props.children}
      </ChatContext.Provider>
    </div>
  );
};

export default ChatProvider;
