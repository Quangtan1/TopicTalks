import { observable, action, makeObservable } from 'mobx';

class PostItemStore {
  postItem = null;

  constructor() {
    makeObservable(this, {
      postItem: observable,
      setPostItem: action,
    });
  }

  setPostItem(postItem) {
    this.postItem = postItem;
    console.log('postItem', postItem);
  }
}

const postItemStore = new PostItemStore();

export default postItemStore;
