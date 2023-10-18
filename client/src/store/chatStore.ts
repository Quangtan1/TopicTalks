import { observable, action, makeObservable } from 'mobx';
import { ListMesage } from 'src/types/chat.type';

class ChatStore {
  chats: ListMesage[] = [];
  selectedChat: ListMesage | null = null;

  constructor() {
    makeObservable(this, {
      chats: observable,
      selectedChat: observable,
      setChats: action,
      setSelectedChat: action,
    });
  }

  setChats(chat) {
    if (Array.isArray(chat)) {
      const chatsort = chat.sort((a, b) => {
        const dateA = new Date(a.conversationInfor.updatedAt).getTime();
        const dateB = new Date(b.conversationInfor.updatedAt).getTime();
        return dateB - dateA;
      });
      this.chats = chatsort;
    } else {
      this.chats = null;
    }
  }
  updateChat(conversationId, updatedConversation) {
    const index = this.chats.findIndex((chat) => chat.conversationInfor.id === conversationId);
    if (index !== -1) {
      this.chats[index] = updatedConversation;
    }
  }
  setSelectedChat(chatSelected) {
    this.selectedChat = chatSelected;
  }
}

const chatStore = new ChatStore();

export default chatStore;
