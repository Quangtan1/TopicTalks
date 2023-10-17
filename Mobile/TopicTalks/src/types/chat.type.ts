interface ITopicChild {
  id: number;
  topicChildrenName: string;
}
interface IConversation {
  id: number;
  chatName: string | null;
  isGroupChat: boolean;
  topicChildren: ITopicChild;
  adminId: number;
  updatedAt?: string;
}
export interface IPartnerDTO {
  id: number;
  username: string;
  banned: boolean;
  image: string;
  bannedAt: string | null;
  member: boolean;
}
export interface ListMesage {
  conversationInfor: IConversation;
  isMember: string;
  partnerDTO: IPartnerDTO[];
}

export interface ICallData {
  data: {
    message: string;
  };
  targetName: string;
  targetId: number;
  timeAt: string;
  userId: number;
  username: string;
  conversationId: number;
}
