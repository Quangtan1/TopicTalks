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

export type GetPropertiesParams = {
  [key: string]: string | number | string[];
};
