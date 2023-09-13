export interface IUser {
  id: number;
  username: string;
  url_img: string;
  roles: string[];
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}
