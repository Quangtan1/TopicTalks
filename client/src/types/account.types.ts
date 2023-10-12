export interface IUser {
  id: number;
  username: string;
  url_img?: string;
  roles: string[];
  email?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}

export interface IUserProfile {
  banned: boolean;
  bannedDate: string | null;
  bio: string;
  country: string;
  dob: string | null;
  email: string;
  fullName: string;
  gender: string;
  id: number;
  imageUrl: string;
  phoneNumber: string;
  role: string;
  username: string;
}
