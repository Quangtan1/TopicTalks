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
import Loading from 'src/components/loading/Loading';
import uiStore from 'src/store/uiStore';

const HomePage = observer(() => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isResize = uiStore?.collapse;

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
    //sau nay isLoading cho post va topic chu ko phai setTimeout
    // setTimeout(() => {
    //   uiStore?.setLoading(false);
    // }, 1000);
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {uiStore?.loading ? (
        <Loading />
      ) : (
        <Grid container className={`new_feed ${isResize ? 'expand_home' : 'collapse_home'}`}>
          <Grid item md={7.5}>
            <PostItem />
          </Grid>
          <Grid item md={4.5}>
            <SuggestBox />
          </Grid>
          {isVisible && (
            <Button className="scroll-to-top" onClick={scrollToTop}>
              <BiArrowToTop />
            </Button>
          )}
        </Grid>
      )}
    </>
  );
});

export default HomePage;
