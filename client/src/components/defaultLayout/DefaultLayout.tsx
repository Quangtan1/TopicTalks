import { Box, Button } from '@mui/material';
import './DefaultLayout.scss';
import Header from '../layouts/header/Header';
import Loading from '../loading/Loading';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import { useState, useEffect } from 'react';
import { BiArrowToTop } from 'react-icons/bi';
import { HiArrowUp } from 'react-icons/hi';
import Footer from '../layouts/footer/Footer';

const DefaultLayout = observer(({ children }) => {
  const isLoading = uiStore?.loading;
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
        {children}
        {isVisible && (
          <Button className="scroll-to-top" onClick={scrollToTop}>
            <HiArrowUp />
          </Button>
        )}
        <Footer />
      </Box>
    </Box>
  );
});

export default DefaultLayout;
