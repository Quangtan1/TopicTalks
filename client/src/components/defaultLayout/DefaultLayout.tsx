import { Box } from '@mui/material';
import './DefaultLayout.scss';
import Header from '../layouts/header/Header';
import SideBar from '../layouts/sidebar/SideBar';
import Loading from '../loading/Loading';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';

const DefaultLayout = observer(({ children }) => {
  const isLoading = uiStore?.loading;
  return (
    <Box className="common-page-container">
      {isLoading && <Loading />}
      <Header />
      <Box className="route-container">
        <SideBar />
        {children}
      </Box>
    </Box>
  );
});

export default DefaultLayout;
