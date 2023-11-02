import React from 'react';
import './AccessTooltip.scss';
import { Box, Dialog, Typography } from '@mui/material';
import { FaCloud } from 'react-icons/fa';
import { IMessage } from 'src/types';
import { BsPersonCircle } from 'react-icons/bs';
import { AiFillMail } from 'react-icons/ai';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { createAxios, postDataAPI } from 'src/utils';
import chatStore from 'src/store/chatStore';
import uiStore from 'src/store/uiStore';
import { useNavigate } from 'react-router-dom';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  dataTooltip: IMessage;
  topicId: number;
}
const AccessTooltip = observer((props: DialogProps) => {
  const { open, onClose, dataTooltip, topicId } = props;
  const account = accountStore?.account;
  const navigate = useNavigate();

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const accessChat = () => {
    const dataRequest = {
      userIdInSession: account.id,
    };
    uiStore?.setLoading(true);
    postDataAPI(`/participant/${dataTooltip.userId}`, dataRequest, account.access_token, axiosJWT)
      .then((res) => {
        const result = chatStore?.chats.some(
          (item) => item.conversationInfor.id === res.data.data.conversationInfor.id,
        );
        if (result) {
          chatStore?.setSelectedChat(res.data.data);
        } else {
          chatStore?.setChats([res.data.data, ...chatStore?.chats]);
          chatStore?.setSelectedChat(res.data.data);
        }
        uiStore?.setLoading(false);
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigateProfile = (id: number) => {
    navigate(`/personal-profile/${id}`);
  };

  return (
    <Dialog open={open} onClose={onClose} className="access_tooltip">
      <FaCloud className="backgroud_access" />
      <Box className="box_option">
        <Typography>{dataTooltip.username}</Typography>
        <Typography onClick={() => navigateProfile(dataTooltip.userId)}>
          <BsPersonCircle /> Personal Profile
        </Typography>
        <Typography onClick={accessChat}>
          <AiFillMail />
          Message
        </Typography>
        <Typography onClick={onClose}>Cancel</Typography>
      </Box>
    </Dialog>
  );
});

export default AccessTooltip;
