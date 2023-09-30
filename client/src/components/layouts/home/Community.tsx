import { Grid } from '@mui/material';
import './Community.scss';
import SuggestBox from './suggestbox/SuggestBox';
import { observer } from 'mobx-react';
import Loading from 'src/components/loading/Loading';
import uiStore from 'src/store/uiStore';
import PostItem from '../postManagement/post/PostItem';

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
