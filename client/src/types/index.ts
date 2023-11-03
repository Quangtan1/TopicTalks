export interface Location {
  street: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
}

export interface Owner {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  location: Location;
  registerDate: string;
  updatedDate: string;
}

export interface Tag {
  [index: number]: string;
}

export interface DataItem {
  id: string;
  image: string;
  likes: number;
  tags: string[];
  text: string;
  publishDate: string;
  owner: Owner;
}

export interface ApiResponse {
  data: DataItem[];
  total: number;
  page: number;
  limit: number;
}

interface DataMessage {
  message: string;
}
export interface IMessage {
  conversationId: number;
  data: DataMessage;
  userId: number;
  timeAt: string;
  username: string;
  groupChatName: string;
  groupChat: boolean;
}

export interface INotifiSystem {
  notiId: number;
  userId: number;
  username: string;
  partnerId?: number;
  partnerUsername?: string;
  message: string;
  postId?: number;
  isRead?: boolean;
  conversationId?: number;
  isGroupChat?: boolean;
  chatName?: string;
  postImage?: string;
  groupImage?: string;
  createAt?: string;
}
