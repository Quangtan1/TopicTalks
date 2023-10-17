export interface ListTopic {
  id: number;
  topicParentName: string;
}

export interface TopicChild {
  parentId: number;
  id: number;
  topicChildrenName: string;
  image: string;
}
