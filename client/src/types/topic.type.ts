export interface ListTopic {
  id: number;
  topicParentName: string;
  image: string;
  shortDescript: string;
  createdAt: string;
}

export interface TopicChild {
  parentId: number;
  id: number;
  topicChildrenName: string;
  image: string;
  shortDescript: string;
  expired?: boolean;
}

export interface RatingByTopicChild {
  rating: number;
  tpcId: number;
  userId: number;
}
