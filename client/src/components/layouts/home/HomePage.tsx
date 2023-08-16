import { Box, Grid, Button } from '@mui/material';
import './HomePage.scss';
import Header from '../header/Header';
import SideBar from '../sidebar/SideBar';
import PostItem from './post/PostItem';
import SuggestBox from './suggestbox/SuggestBox';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { BiArrowToTop } from 'react-icons/bi';

const HomePage = observer(() => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
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
    console.log('aaaccc', accountStore?.account);
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <Box className="home-page-container">
      <Header />
      <Box className="new-feed-container">
        <SideBar />
        <Grid container className="new-feed">
          <Grid item md={7.5}>
            <PostItem />
          </Grid>
          <Grid item md={4.5}>
            <SuggestBox />
          </Grid>
        </Grid>
      </Box>
      {isVisible && (
        <Button className="scroll-to-top" onClick={scrollToTop}>
          <BiArrowToTop />
        </Button>
      )}
    </Box>
  );
});

export default HomePage;
