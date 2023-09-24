import { ReactNode } from 'react';

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

export type Action = {
  title: string;
  icon: ReactNode;
  isHidden?: boolean;
};

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

export interface IPost {
  id: number;
  content: string;
  title: string;
  img_url: string;
  tparent_id: number;
  author_id: number;
  created_at: string;
  updated_at: string;
  approved: boolean;
}

export interface IComment {
  id: number;
  user: string;
  text: string;
}
