import { Box } from '@mui/material';
import './AdminLayout.scss';
import SideBar from '../sidebar/SideBar';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import Loading from 'src/components/loading/Loading';
import uiStore from 'src/store/uiStore';
import Header from '../header/Header';

const AdminLayout = observer(({ children }) => {
  const account = accountStore?.account;
  const isLoading = uiStore?.loading;
  return (
    <>
      {account.roles.includes('ROLE_ADMIN') && (
        <>
          <Box className="common-page-container_admin">
            {isLoading && <Loading />}
            {/* <Header /> */}
            <Box className="route-container">
              <SideBar />
              {account !== null && children}
            </Box>
          </Box>
        </>
      )}
    </>
  );
});

export default AdminLayout;
