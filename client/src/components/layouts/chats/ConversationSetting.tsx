import { Avatar, Box, Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import accountStore from 'src/store/accountStore';
import { ListMesage } from 'src/types/chat.type';

interface ChatProps {
  chat: ListMesage;
}
const ConversationSetting = observer((props: ChatProps) => {
  const { chat } = props;
  const isGroup = chat?.conversationInfor.isGroupChat;
  const isAdmin = chat?.conversationInfor.adminId === accountStore?.account.id;
  return (
    <Box className="conver_setting_container">
      <Box className="container_setting">
        <Box className="avatar_setting">
          <Avatar src={isGroup ? '' : chat?.partnerDTO[0].image} alt="avt" className="avatar" />
          <Typography>{isGroup ? chat?.conversationInfor.chatName : chat.partnerDTO[0].username}</Typography>
        </Box>
        <Box className="topic_setting">
          <Typography>Topic:</Typography>
          <Typography>{chat?.conversationInfor.topicChildren.topicChildrenName}</Typography>
          {isAdmin && <AiOutlineEdit />}
        </Box>
        {isGroup && (
          <Box className="member_setting">
            <Typography>Chat members</Typography>
            {chat?.partnerDTO.map((item) => (
              <Box className="memeber_item" key={item.id}>
                <Box className="infor_member">
                  <Avatar src={item.image} alt="avt" className="member_avt" />
                  <Typography>
                    {item.username}
                    <strong>{chat?.conversationInfor.adminId === item.id && '(Admin)'}</strong>
                  </Typography>
                </Box>
                {isAdmin && <RiDeleteBin6Line className="svg_item" />}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      {isAdmin ? (
        <Button className="button_delete">Delete Conversation</Button>
      ) : (
        <Button className="button_delete">Leave Conversation</Button>
      )}
    </Box>
  );
});

export default ConversationSetting;
