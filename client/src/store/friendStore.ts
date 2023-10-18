import { observable, action, makeObservable } from 'mobx';
import { IFriends } from 'src/types/account.types';

class FriendStore {
  friends: IFriends[] = [];

  constructor() {
    makeObservable(this, {
      friends: observable,
      setFriends: action,
    });
  }

  setFriends(friends) {
    this.friends = friends;
  }
}

const friendStore = new FriendStore();

export default friendStore;
