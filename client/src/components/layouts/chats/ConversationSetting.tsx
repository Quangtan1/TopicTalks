import { Avatar, Box, Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FcCollapse, FcExpand, FcOk, FcTimeline } from 'react-icons/fc';
import { TiDeleteOutline } from 'react-icons/ti';
import accountStore from 'src/store/accountStore';
import chatStore from 'src/store/chatStore';
import { IPartnerDTO, ListMesage } from 'src/types/chat.type';
import { createAxios, putDataAPI } from 'src/utils';
import { ToastSuccess } from 'src/utils/toastOptions';

interface ChatProps {
  chat: ListMesage;
}
const ConversationSetting = observer((props: ChatProps) => {
  const [collapse, setCollapse] = useState<number[]>([1]);
  const { chat } = props;
  const isGroup = chat?.conversationInfor.isGroupChat;
  const isAdmin = chat?.conversationInfor.adminId === accountStore?.account.id;
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleCollapse = (id: number) => {
    if (collapse.includes(id)) {
      const newCollap = collapse.filter((idItem) => idItem !== id);
      setCollapse(newCollap);
    } else {
      setCollapse([...collapse, id]);
    }
  };

  useEffect(() => {
    setCollapse([1]);
  }, [chat]);

  const memberDTO = chat?.partnerDTO.filter((item) => item.member);
  const memberWating = chat?.partnerDTO.filter((item) => !item.member);

  const handleAprrove = (member: IPartnerDTO) => {
    const approveData = {
      userInSessionId: account.id,
      conversationId: chat?.conversationInfor.id,
      memberId: member.id,
    };
    putDataAPI(`/participant/approve-member`, approveData, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess(`You have just approved ${member.username}`);
        chatStore?.setSelectedChat(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box className="conver_setting_container">
      <Box className="container_setting">
        <Box className="avatar_setting">
          <Avatar src={isGroup ? '' : chat?.partnerDTO[0].image} alt="avt" className="avatar" />
          <Typography>{isGroup ? chat?.conversationInfor.chatName : chat?.partnerDTO[0].username}</Typography>
        </Box>
        <Box className="topic_setting">
          <Typography>Topic:</Typography>
          <Typography>{chat?.conversationInfor.topicChildren.topicChildrenName}</Typography>
          {isAdmin && <AiOutlineEdit />}
        </Box>
        {isGroup && (
          <Box className="member_setting">
            <Box className="title_member_setting">
              <Typography>
                <FcTimeline />
                Members
              </Typography>
              <span onClick={() => handleCollapse(1)}>{collapse.includes(1) ? <FcExpand /> : <FcCollapse />}</span>
            </Box>

            {collapse.includes(1) &&
              memberDTO.map((item) => (
                <Box className="memeber_item" key={item.id}>
                  <Box className="infor_member">
                    <Avatar src={item.image} alt="avt" className="member_avt" />
                    <Typography>
                      {item.username}
                      <strong>{chat?.conversationInfor.adminId === item.id && '(Admin)'}</strong>
                    </Typography>
                  </Box>
                  {isAdmin && <TiDeleteOutline className="svg_item" />}
                </Box>
              ))}

            {isAdmin && (
              <Box className="title_member_setting">
                <Typography>
                  <FcTimeline />
                  Members Waiting
                </Typography>
                <span onClick={() => handleCollapse(2)}>{collapse.includes(2) ? <FcExpand /> : <FcCollapse />}</span>
              </Box>
            )}

            {collapse.includes(2) &&
              isAdmin &&
              memberWating.map((item) => (
                <Box className="memeber_item" key={item.id}>
                  <Box className="infor_member">
                    <Avatar src={item.image} alt="avt" className="member_avt" />
                    <Typography>
                      {item.username}
                      <strong>{chat?.conversationInfor.adminId === item.id && '(Admin)'}</strong>
                    </Typography>
                  </Box>

                  {isAdmin && (
                    <Box className="option_member">
                      <FcOk onClick={() => handleAprrove(item)} />
                      <TiDeleteOutline className="svg_item" />
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        )}
      </Box>
      {isAdmin || !isGroup ? (
        <Button className="button_delete">Delete Conversation</Button>
      ) : (
        <Button className="button_delete">Leave Conversation</Button>
      )}
    </Box>
  );
});

export default ConversationSetting;
