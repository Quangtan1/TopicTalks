export enum Example {
  Id = 'id',
  Name = 'name',
  Class = 'class',
}

export enum User {
  UserId = 'userId',
  Id = 'id',
  Title = 'title',
  Body = 'body',
}

export interface IExample {
  [Example.Id]?: string;
  [Example.Name]?: string;
  [Example.Class]?: string;
}

export interface IUser {
  [User.Id]?: string;
  [User.UserId]?: string;
  [User.Body]?: string;
  [User.Title]?: string;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  img_url: string;
  tparent_id: number;
  author_id: number;
  created_at: string;
  updated_at: string;
  approved: boolean;
}


export type GetPropertiesParams = {
  [key: string]: string | number | string[];
};
