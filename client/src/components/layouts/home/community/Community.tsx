import { Box, Button, Grid, Tab, Tabs } from '@mui/material';
import './Community.scss';
import { observer } from 'mobx-react';
import Loading from 'src/components/loading/Loading';
import uiStore from 'src/store/uiStore';
import PostItem from 'src/components/layouts/postManagement/post/PostItem';
import React from 'react';
import NewPost from '../../postManagement/newPost/NewPost';

const HomePage = observer(() => {
  const isResize = uiStore?.collapse;
  const [activeTab, setActiveTab] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      {uiStore?.loading ? (
        <Loading />
      ) : (
        <Grid container className={`new_feed ${isResize ? 'expand_home' : 'collapse_home'}`}>
          <Grid item md={12} className="containerCommunity">
            <Box className="headerWrap">
              <Tabs
                value={activeTab}
                className="tabContainer"
                onChange={(event, newValue) => setActiveTab(newValue)}
                sx={{ backgroundColor: 'white', justifyContent: 'space-between', margin: '0 22px', borderRadius: 20 }}
                indicatorColor="secondary"
                textColor="secondary"
              >
                <Tab label="Post" />
                <Tab label="Publicity" />
                <Tab label="Following Posts" />
              </Tabs>
              <Button variant="outlined" onClick={() => setIsOpen(true)}>
                Create a post
              </Button>
            </Box>
            <NewPost open={isOpen} closePostModal={() => setIsOpen(!isOpen)} />
          </Grid>
          <Grid md={12} item>
            <PostItem />
          </Grid>
        </Grid>
      )}
    </>
  );
});

export default HomePage;
