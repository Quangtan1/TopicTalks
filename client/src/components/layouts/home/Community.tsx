import { Grid, Button } from '@mui/material';
import './Community.scss';
import SuggestBox from './suggestbox/SuggestBox';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { BiArrowToTop } from 'react-icons/bi';
import Loading from 'src/components/loading/Loading';
import uiStore from 'src/store/uiStore';
import PostItem from './post/PostItem';

const HomePage = observer(() => {
  const isResize = uiStore?.collapse;

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
        </Grid>
      )}
    </>
  );
});

export default HomePage;
