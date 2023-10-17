import { observable, action, makeObservable } from 'mobx';

class FriendStore {
  friends = null;

  constructor() {
    makeObservable(this, {
      friends: observable,
      setFriends: action,
    });
  }

  setFriends(friends) {
    this.friends = friends;
    console.log('friends', friends);
  }
}

const friendStore = new FriendStore();

export default friendStore;
