import { observable, action, makeObservable } from 'mobx';
import { LastMessage, ListMesage } from 'src/types/chat.type';

class ChatStore {
  chats: ListMesage[] = [];
  selectedChat: ListMesage | null = null;

  constructor() {
    makeObservable(this, {
      chats: observable,
      selectedChat: observable,
      setChats: action,
      setSelectedChat: action,
      updateLastMessage: action,
      updateChat: action,
    });
  }

  setChats(chat) {
    this.chats = chat;
  }
  updateChat(conversationId, groupName?: string, grouImage?: string) {
    const index = this.chats.findIndex((chat) => chat.conversationInfor.id === conversationId);
    if (index !== -1) {
      const updatedChat = {
        ...this.chats[index],
        conversationInfor: {
          ...this.chats[index].conversationInfor,
          chatName: groupName,
          avtGroupImg: grouImage,
        },
      };
      this.chats[index] = updatedChat;
    }
  }
  updateLastMessage(conversationId: number, lastMessage: LastMessage) {
    const index = this.chats.findIndex((chat) => chat.conversationInfor.id === conversationId);
    if (index !== -1) {
      const updatedChat = {
        ...this.chats[index],
        conversationInfor: {
          ...this.chats[index].conversationInfor,
          lastMessage: lastMessage,
        },
      };
      this.chats[index] = updatedChat;
    }
  }
  setSelectedChat(chatSelected) {
    this.selectedChat = chatSelected;
  }
}

const chatStore = new ChatStore();

export default chatStore;
