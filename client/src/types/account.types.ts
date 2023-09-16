export interface IUser {
  id: number;
  username: string;
  url_img: string;
  roles: string[];
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  phone_number?: string;
  user_id?: number;
  created_at?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  bio?: string;
  is_banned?: boolean;
  dob?: string;
  gender?: string;
  country?: string;
  banned_date?: string;
}