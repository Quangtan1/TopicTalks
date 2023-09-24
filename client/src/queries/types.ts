export enum Example {
  Id = 'id',
  Name = 'name',
  Class = 'class',
}

export interface IExample {
  [Example.Id]?: string;
  [Example.Name]?: string;
  [Example.Class]?: string;
}

export interface ITopicChildren {
  createdAt: string;
  updatedAt: string;
  id: number;
  topicChildrenName: string;
  urlImage?: string;
}

export interface ITopicParent {
  id: number;
  topicParentName: string;
  createAt: string;
  updateAt: string;
}

export interface IPostContent {
  content: string;
  image?: any;
  author_id: number;
  title: string;
  tparent_id: number;
}



export type GetPropertiesParams = {
  [key: string]: string | number | string[];
};
