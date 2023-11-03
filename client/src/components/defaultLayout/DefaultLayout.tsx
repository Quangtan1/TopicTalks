import { Box, Button } from '@mui/material';
import './DefaultLayout.scss';
import Header from '../layouts/header/Header';
import Loading from '../loading/Loading';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import { useState, useEffect, useContext } from 'react';
import { BiArrowToTop } from 'react-icons/bi';
import { HiArrowUp } from 'react-icons/hi';
import { FaFacebookMessenger } from 'react-icons/fa';
import Footer from '../layouts/footer/Footer';
import accountStore from 'src/store/accountStore';
import { createAxios, getDataAPI } from 'src/utils';
import chatStore from 'src/store/chatStore';
import ListMessage from './ListMessage';
import { ListMesage } from 'src/types/chat.type';
import { MdNotificationsActive } from 'react-icons/md';
import ChatContext from 'src/context/ChatContext';

const DefaultLayout = observer(({ children }) => {
  const isLoading = uiStore?.loading;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [sortChats, setSortChat] = useState<ListMesage[]>([]);

  const { notification } = useContext(ChatContext);

  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const toggleVisibility = () => {
    if (window.pageYOffset > 250) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleGetMessage = () => {
    if (chatStore?.chats.length === 0) {
      // uiStore?.setLoading(true);
      getDataAPI(`/participant/${account.id}/all`, account.access_token, axiosJWT)
        .then((res) => {
          chatStore?.setChats(res.data.data);
          setSortChat(res.data.data);
          // uiStore?.setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      chatStore?.setChats([]);
    }
  };

  useEffect(() => {
    uiStore?.setLoading(false);
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <Box className="common-page-container">
      {isLoading && <Loading />}
      <Header />
      <Box className="route-container">
        {account !== null && children}
        {isVisible && (
          <Button className="scroll-to-top" onClick={scrollToTop}>
            <HiArrowUp />
          </Button>
        )}
        {chatStore?.chats.length > 0 && <ListMessage sortChats={sortChats} />}
        {account !== null && <FaFacebookMessenger className="message_tooltip" onClick={handleGetMessage} />}
        {account !== null && notification?.length > 0 && <MdNotificationsActive className="notifi_message" />}

        <Footer />
      </Box>
    </Box>
  );
});

export default DefaultLayout;
