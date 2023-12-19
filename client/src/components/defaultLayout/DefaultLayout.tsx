import { Box, Button, Input, InputAdornment, Typography } from '@mui/material';
import './DefaultLayout.scss';
import Header from '../layouts/header/Header';
import Loading from '../loading/Loading';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import { useState, useEffect, useContext } from 'react';
import { HiArrowUp } from 'react-icons/hi';
import { FaFacebookMessenger } from 'react-icons/fa';
import accountStore from 'src/store/accountStore';
import { createAxios, getDataAPI } from 'src/utils';
import chatStore from 'src/store/chatStore';
import ListMessage from './ListMessage';
import { ListMesage } from 'src/types/chat.type';
import { MdNotificationsActive } from 'react-icons/md';
import ChatContext from 'src/context/ChatContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { CiMicrophoneOff, CiMicrophoneOn, CiSearch } from 'react-icons/ci';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ToastError } from 'src/utils/toastOptions';
import Footer from '../layouts/footer/Footer';
import PageNotResponsive from '../layouts/pagenotfound/PageNotResponsive';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const DefaultLayout = observer(({ children }) => {
  const isLoading = uiStore?.loading;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [sortChats, setSortChat] = useState<ListMesage[]>([]);
  const [openList, setOpenList] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { startListening, stopListening } = SpeechRecognition;
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript !== '') {
      setInputSearch(transcript);
      resetTranscript();
    }
  }, [transcript]);

  const handleSpeechRecognition = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };
  const { notification } = useContext(ChatContext);

  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
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
    if (!openList) {
      getDataAPI(`/participant/${account.id}/all`, account.access_token, axiosJWT)
        .then((res) => {
          chatStore?.setChats(res.data.data);
          setSortChat(res.data.data);
          setOpenList(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setOpenList(false);
    }
  };

  useEffect(() => {
    uiStore?.setLoading(false);
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  useEffect(() => {
    scrollToTop();
    setIsSearch(false);
    setOpenList(false);
  }, [location]);

  const handleSearch = (isSearch: boolean) => {
    setIsSearch(isSearch);
  };

  const disableSearch = inputSearch === '';

  const navigateTopic = () => {
    if (!disableSearch) {
      setIsSearch(false);
      navigate(`/list-topic/search/${inputSearch}`);
      setInputSearch('');
    } else {
      ToastError('Please input data...');
    }
  };

  return (
    <>
      <PageNotResponsive />
      <Box className="common-page-container">
        {isLoading && <Loading />}
        <Header handleSearch={handleSearch} />
        {isSearch ? (
          <Box className="search_container">
            <Typography className="title_search">SEARCH</Typography>
            <Input
              value={inputSearch}
              placeholder="Search topics here..."
              endAdornment={
                <InputAdornment position="end">
                  <>
                    {listening ? (
                      <CiMicrophoneOn onClick={handleSpeechRecognition} />
                    ) : (
                      <CiMicrophoneOff onClick={handleSpeechRecognition} />
                    )}
                    <CiSearch style={{ marginLeft: '6px' }} onClick={navigateTopic} />
                  </>
                </InputAdornment>
              }
              onKeyDown={(e) => {
                if (e.keyCode === 13 && !e.shiftKey) {
                  navigateTopic();
                }
              }}
              onChange={(e) => setInputSearch(e.target.value)}
              className="input_search"
            />
            <Box className="suggested_search">
              <Typography>Suggested keywords</Typography>
              <Box className="suggets">
                <Typography>World</Typography>
                <Typography>Tech</Typography>
                <Typography>Healthy</Typography>
                <Typography>Science</Typography>
                <Typography>Books</Typography>
                <Typography>Travel</Typography>
                <Typography>Business</Typography>
                <Typography>Music</Typography>
              </Box>
              <>
                <AiOutlineCloseCircle onClick={() => setIsSearch(false)} />
              </>
            </Box>
          </Box>
        ) : (
          <Box className="route-container">
            {account !== null && children}
            {isVisible && (
              <Button className="scroll-to-top" onClick={scrollToTop}>
                <HiArrowUp />
              </Button>
            )}
            {openList && <ListMessage sortChats={sortChats} setSortChat={setSortChat} />}
            {account !== null && <FaFacebookMessenger className="message_tooltip" onClick={handleGetMessage} />}
            {account !== null && notification?.length > 0 && <MdNotificationsActive className="notifi_message" />}
          </Box>
        )}

        <Footer scrollToTop={scrollToTop} />
      </Box>
    </>
  );
});

export default DefaultLayout;
