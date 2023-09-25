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
}
