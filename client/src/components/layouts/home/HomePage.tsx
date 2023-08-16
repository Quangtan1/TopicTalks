import { Box, Grid } from '@mui/material';
import './HomePage.scss';
import Header from '../header/Header';
import SideBar from '../sidebar/SideBar';
import PostItem from './post/PostItem';
import SuggestBox from './suggestbox/SuggestBox';
// import { useGetAllExample, useUpdateExample } from 'src/queries';
// import { useEffect } from 'react';

const HomePage = () => {
  // ======================= EXAMPLE QUERY =======================
  // const { example, setParams } = useGetAllExample();
  // useEffect(() => {
  //   setParams({ page: 1, limit: 10 });
  // }, [setParams]);

  // ======================= EXAMPLE MUTATION =======================
  // const { onUpdateExample, isSuccess } = useUpdateExample();
  // useEffect(() => {
  //   const body = {
  //     id: '1',
  //     name: 'test',
  //     class: '',
  //   };
  //   onUpdateExample(body);
  // }, [onUpdateExample]);

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
    </Box>
  );
};

export default HomePage;
