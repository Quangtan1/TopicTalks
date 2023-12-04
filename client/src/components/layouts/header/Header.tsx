import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon, Grid } from '@mui/material';
import './Header.scss';
import { IoMailUnreadOutline, IoNotificationsOutline } from 'react-icons/io5';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { headerRoute, logo, logo1, logo_center } from 'src/utils';
import NotificationDialog from 'src/components/dialogs/NotificationDialog';
import ChatContext from 'src/context/ChatContext';
import { notification_worker_script, worker_script } from '../../../utils/woker';
import friendStore from 'src/store/friendStore';
import uiStore from 'src/store/uiStore';
import { CiSearch } from 'react-icons/ci';

//consts
const LOGOUT_CONTENT = 'Do you want to logout?';

interface IHeaderProps {
  handleSearch: (isSearch) => void;
}

const Header = observer((props: IHeaderProps) => {
  const { handleSearch } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeRoute, setActiveRoute] = useState<string>('/home');
  const [openNotifi, setOpenNotifi] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  let worker;
  let notificationWorker;

  const { notifiSystem, setNotifiSystem } = useContext(ChatContext);

  const account = accountStore?.account;
  const accountRole = accountStore?.account?.roles;

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

  const handleClickOutsideMenu = (event) => {
    const idMenu = document.querySelector('#anchor');
    if (!idMenu?.contains(event.target)) {
      setAnchorEl(false);
    }
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

      notificationWorker = new Worker(notification_worker_script);
      notificationWorker.onmessage = (ev: any) => {
        if (ev.data !== 'Empty') {
          setNotifiSystem(ev.data);
        }
      };
      notificationWorker.postMessage(params);
    }

    return () => {
      account === null && friendStore?.setFriends([]);
    };
  }, [account, location]);

  useEffect(() => {
    if (account) {
      accountRole?.includes('ROLE_ADMIN') && navigate('/dashboard');
    }
    account === null && navigate('/landing-view');

    uiStore?.setLocation(currentPath);
    setActiveRoute(currentPath);
  }, [location]);

  useEffect(() => {
    account?.isBanned && account !== null && navigate('/ban-page');
    window.addEventListener('click', handleClickOutsideMenu);
    return () => {
      window.removeEventListener('click', handleClickOutsideMenu);
    };
  }, [account]);

  const handleGoToProfilePage = () => {
    handleClose();
    navigate(`/personal-profile/${account.id}`);
  };

  const handleActive = (navigate: string) => {
    setActiveRoute(navigate);
  };

  const notifiRead = notifiSystem?.filter((item) => !item.isRead);
  const listRequest =
    friendStore?.friends !== null &&
    friendStore?.friends?.filter((item) => !item.accept && account?.id === item.friendId);
  const totalNotifi = (notifiRead ? notifiRead?.length : 0) + (listRequest ? listRequest?.length : 0);

  return (
    <Box className="header">
      <Grid container className="first_header">
        <Grid item md={4} className="logo_sidebar">
          <Box
            sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', alignItems: 'center' }}
            onClick={() => navigate('/home')}
          >
            <img
              src={logo}
              alt="logoT"
              width={70}
              height={70}
              style={{ backgroundColor: 'white', padding: 8, marginRight: 4, marginBottom: 3 }}
            />
            <Typography variant="h5" component="h2" style={{ fontWeight: 'bold' }}>
              TopicTalks
            </Typography>
          </Box>
        </Grid>
        <Grid item md={4} className="image">
          {/* <img src={logo_center} alt="logo_center" className="logo_center" /> */}
        </Grid>
        <Grid item md={4} className="infor_header">
          <CiSearch className="search" onClick={() => handleSearch(true)} />
          <IoNotificationsOutline onClick={() => setOpenNotifi(true)} />
          <span className="notifi_icon">{totalNotifi}</span>
          <IconButton onClick={() => setAnchorEl(!anchorEl)} id="anchor">
            <Avatar src={account?.url_img} alt="avatar" />
          </IconButton>
          {anchorEl && (
            <Box className="menu_box" id="anchor">
              <MenuItem className="item" onClick={handleGoToProfilePage}>
                <ListItemIcon>
                  <Avatar src={account?.url_img} alt="avatar" />
                </ListItemIcon>
                Profile Infor
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => setOpen(true)}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Box>
          )}
          <Typography className="name_account">{account?.username?.slice(0, 11)}</Typography>
        </Grid>
      </Grid>
      <Box className="header_option">
        {headerRoute.map((item, index) => (
          <Typography
            key={index}
            onClick={() => {
              navigate(`${item.path}`);
              handleActive(item.path);
              handleSearch(false);
            }}
            className={`${activeRoute === item.path && 'selected_navigate'}`}
          >
            {item.title}
          </Typography>
        ))}
      </Box>
      {openNotifi && <NotificationDialog open={openNotifi} onClose={() => setOpenNotifi(false)} />}
      {open && <DialogCommon open={open} onClose={onClose} onConfirm={onConfirm} content={LOGOUT_CONTENT} />}
    </Box>
  );
});

export default Header;
