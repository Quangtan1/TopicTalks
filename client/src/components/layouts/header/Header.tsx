import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import './Header.scss';
import { IoMailUnreadOutline, IoNotificationsOutline } from 'react-icons/io5';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { headerRoute, logo } from 'src/utils';
import NotificationDialog from 'src/components/dialogs/NotificationDialog';
import ChatContext from 'src/context/ChatContext';
import { worker_script } from '../../../utils/woker';
import friendStore from 'src/store/friendStore';

//consts
const LOGOUT_CONTENT = 'Do you want to logout?';

const Header = observer(() => {
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeRoute, setActiveRoute] = useState<string>('/landing-view');
  const [openNotifi, setOpenNotifi] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  let worker;

  const { notification } = useContext(ChatContext);

  const account = accountStore?.account;
  const accountRole = accountStore?.account?.roles;

  const openMenu = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onConfirm = () => {
    accountStore?.setAccount(null);
    accountStore?.clearStore();
    setAnchorEl(false);
    navigate('/auth');
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (account !== null) {
      worker = new Worker(worker_script);
      worker.onmessage = (ev) => {
        if (ev.data !== 'Empty') {
          friendStore?.setFriends(ev.data);
        }
      };
      const params = {
        id: account?.id,
        access_token: account?.access_token,
      };
      worker.postMessage(params);
    }
    return () => {
      friendStore?.setFriends([]);
    };
  }, [account, location]);

  useEffect(() => {
    account === null && navigate('/auth');
    if (account) {
      accountRole.includes('ROLE_ADMIN') && navigate('/dashboard');
    }
    setActiveRoute(currentPath);
  }, [location]);

  const handleGoToProfilePage = () => {
    handleClose();
    navigate(`/personal-profile/${account.id}`);
  };

  const handleActive = (navigate: string) => {
    setActiveRoute(navigate);
  };

  return (
    <Box className="header">
      <Box className="logo_sidebar">
        <img src={logo} alt="logo" />
        <Box className="title_logo">
          <Typography>TopicTalks</Typography>
          <Typography>Anonymously</Typography>
        </Box>
      </Box>
      <Box className="header_option">
        {headerRoute.map((item, index) => (
          <Typography
            key={index}
            onClick={() => {
              navigate(`${item.path}`);
              handleActive(item.path);
            }}
            className={`${activeRoute === item.path && 'selected_navigate'}`}
          >
            {item.title}
          </Typography>
        ))}
      </Box>
      <Box className="infor_header">
        <IoMailUnreadOutline />
        <IoNotificationsOutline onClick={() => setOpenNotifi(true)} />
        <span className="notifi_icon">{notification.length}</span>
        <IconButton onClick={() => setAnchorEl(true)}>
          <Avatar src={account?.url_img} alt="avatar" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={openMenu}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            className: 'custom-paper',
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem onClick={handleGoToProfilePage}>
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
        <Typography className="name_account">{account?.username?.slice(0, 11)}</Typography>
      </Box>
      {openNotifi && <NotificationDialog open={openNotifi} onClose={() => setOpenNotifi(false)} />}
      {open && <DialogCommon open={open} onClose={onClose} onConfirm={onConfirm} content={LOGOUT_CONTENT} />}
    </Box>
  );
});

export default Header;
