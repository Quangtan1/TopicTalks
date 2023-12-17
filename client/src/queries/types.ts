import { ReactNode } from 'react';

export enum Example {
  Id = 'id',
  Name = 'name',
  Class = 'class',
}

export interface IFriends {
  friendListId: number;
  userid: number;
  userName: string;
  userUrl: string;
  userActive: boolean;
  friendId: number;
  friendName: string;
  friendUrl: string;
  friendActive: boolean;
  updatedAt: string;
  createdAt: string;
  public: boolean;
  accept: boolean;
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

export interface ILike {
  totalLike: number;
  userLike: IUserLike[];
}
export interface IUserLike {
  id: number;
  username: string;
}
export interface IPost {
  id: number;
  content: string;
  title: string;
  img_url: string;
  totalComment: number;
  tparent_id: number;
  topicName: string;
  author_active: boolean;
  like: ILike;
  avatar_url: string;
  username: string;
  author_id: number;
  status: number;
  statusName: string;
  created_at: string;
  updated_at: string;
  approved: boolean;
  lastComment?: ILastComment;
  rejected: boolean;
  reasonRejected?: string;
}

export interface ILastComment {
  id: number;
  userId: number;
  username: string;
  userImage: string;
  content: string;
  createAt: string;
}

export interface IUserInformation {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  dob?: string;
  bio?: string;
  gender?: string;
  country?: string;
  imageUrl?: string;
  bannedDate?: string;
  role: string;
  updatedAt: string;
  createdAt: string;
  banned: boolean;
}

export interface ICommentBody {
  postId: number;
  userId: number;
  content: string;
}

export interface IComment {
  id: number;
  postId: number;
  userId: number;
  active: boolean;
  username: string;
  userImage: string;
  content: string;
  createAt: string;
  updateAt: string;
}
