interface ITopicChild {
  id: number;
  topicChildrenName: string;
}
interface IConversation {
  id: number;
  chatName: string | null;
  isGroupChat: boolean;
  topicChildren: ITopicChild;
}
interface IPartnerDTO {
  id: number;
  username: string;
  banned: boolean;
  image: string;
  bannedAt: string | null;
}
export interface ListMesage {
  conversationInfor: IConversation;
  partnerDTO: IPartnerDTO;
}
