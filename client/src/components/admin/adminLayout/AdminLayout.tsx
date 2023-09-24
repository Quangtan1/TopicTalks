import { Box } from '@mui/material';
import './AdminLayout.scss';
import Header from '../header/Header';
import SideBar from '../sidebar/SideBar';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';

const AdminLayout = observer(({ children }) => {
  const account = accountStore?.account;
  return (
    <>
      {account.roles.includes('ROLE_ADMIN') && (
        <Box className="common-page-container_admin">
          <Header />
          <Box className="route-container">
            <SideBar />
            {children}
          </Box>
        </Box>
      )}
    </>
  );
});

export default AdminLayout;
