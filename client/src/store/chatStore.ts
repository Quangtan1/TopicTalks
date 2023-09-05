import { observable, action, makeObservable } from 'mobx';

class ChatStore {
  chats = null;
  selectedChat = null;

  constructor() {
    makeObservable(this, {
      chats: observable,
      selectedChat: observable,
      setChats: action,
      setSelectedChat: action,
    });
  }

  setChats(chat) {
    this.chats = chat;
    console.log('chats', chat);
  }
  setSelectedChat(chatSelected) {
    this.selectedChat = chatSelected;
    console.log('chatSelected', chatSelected);
  }
}

const chatStore = new ChatStore();

export default chatStore;
