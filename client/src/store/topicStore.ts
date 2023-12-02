import { observable, action, makeObservable } from 'mobx';
import { TopicChild } from 'src/types/topic.type';

class TopicStore {
  topicChild: TopicChild[] = [];

  constructor() {
    makeObservable(this, {
      topicChild: observable,
      setTopicChild: action,
    });
  }

  setTopicChild(topic: TopicChild[]) {
    this.topicChild = topic;
  }
}

const topicStore = new TopicStore();

export default topicStore;
