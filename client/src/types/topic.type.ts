export interface ListTopic {
  id: number;
  topicParentName: string;
  image: string;
  avgRating?: number;
  shortDescript: string;
  createdAt: string;
}

export interface ListTopicHot {
  id: number;
  avgRating: number | null;
  createdAt: string;
  image: string;
  maxRating: number;
  shortDescription: string;
  topicChildrenId: number;
  topicChildrenName: string;
  tpcCount: number;
  updatedAt: string;
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
