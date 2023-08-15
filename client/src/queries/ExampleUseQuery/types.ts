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
