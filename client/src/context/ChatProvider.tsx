import React, { useState } from 'react';
import ChatContext from './ChatContext';

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = (props) => {
  const [message, setMessage] = useState<any>([]);

  console.log(message, 'message');
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
