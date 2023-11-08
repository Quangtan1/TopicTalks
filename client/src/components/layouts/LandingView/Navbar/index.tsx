import {
  AppBar,
  Toolbar,
  Box,
  List,
  ListItem,
  Typography,
  styled,
  ListItemButton,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DrawerItem from '../DrawerItem';
import { logo1 } from 'src/utils';
import { useState } from 'react';
import { Avatar, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import 'src/components/admin/header/Header.scss';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import accountStore from 'src/store/accountStore';
import DialogCommon from 'src/components/dialogs/DialogCommon';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'black',
});

const ListMenu = styled(List)(({ theme }) => ({
  display: 'none',
  backgroundColor: 'black',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));

const itemList = [
  {
    text: 'About',
    to: '/about',
  },
];

const LOGOUT_CONTENT = 'Do you want to logout?';

const Navbar = (props) => {
  const { isAdmin } = props || {};
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<boolean>(false);

  const account = accountStore?.account;

  const onClose = () => {
    setOpen(false);
  };

  const goToLandingPage = () => {
    navigate('/landing-view');
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

  const goToDashBoard = () => {
    navigate('/dashboard');
  };

  const onLogout = () => {};

  const onConfirm = () => {
    accountStore?.setAccount(null);
    accountStore?.clearStore();
    setAnchorEl(false);
    navigate('/auth');
  };

  return (
    <AppBar
      component="nav"
      position={`${isAdmin ? 'fixed' : 'sticky'}`}
      sx={{
        backgroundColor: 'orange',
      }}
      elevation={0}
    >
      <StyledToolbar>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', alignItems: 'center' }}
          onClick={isAdmin ? goToDashBoard : goToLandingPage}
        >
          <img
            src={logo1}
            alt="logoT"
            width={40}
            height={40}
            style={{ backgroundColor: 'white', padding: 8, marginRight: 12 }}
          />
          <Typography variant="h6" component="h2">
            TopicTalks
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <DrawerItem />
        </Box>
        {!isAdmin ? (
          <ListMenu>
            {itemList.map((item) => {
              const { text } = item;
              return (
                <ListItem key={text}>
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    sx={{
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#1e2a5a',
                      },
                    }}
                  >
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </ListMenu>
        ) : (
          <Box className="menu-bar">
            <IconButton onClick={() => setAnchorEl(true)}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                }}
                src={account?.url_img}
                alt="avatar"
              />
            </IconButton>
            <Menu
              id="account-menu"
              open={anchorEl}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                className: 'custom-paper_admin',
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Avatar src={account?.url_img} alt="avatar" />
                </ListItemIcon>
                Profile Infor
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={() => setOpen(true)}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
            <DialogCommon open={open} onClose={onClose} onConfirm={onConfirm} content={LOGOUT_CONTENT} />
          </Box>
        )}
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
