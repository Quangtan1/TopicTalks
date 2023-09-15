import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';
import './Header.scss';
import { headerRoute } from 'src/utils/consts';
import { RiSearchLine } from 'react-icons/ri';
import { HiOutlineSun } from 'react-icons/hi';
import { BiGroup } from 'react-icons/bi';
import { IoMailUnreadOutline, IoNotificationsOutline } from 'react-icons/io5';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';

//consts
const LOGOUT_CONTENT = 'Do you want to logout?';

const Header = observer(() => {
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<boolean>(false);
  const navigate = useNavigate();

  const account = accountStore?.account;

  const handleClose = () => {
    setAnchorEl(false);
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
    account === null && navigate('/auth');
  }, []);

  return (
    <Box className="header_container_admin">
      <Grid container className="grid_container">
        <Grid item md={7} className="header-bar"></Grid>
        <Grid item md={5} className="info-bar">
          <Box className="menu-bar">
            <HiOutlineSun />
            <BiGroup />
            <IoMailUnreadOutline />
            <IoNotificationsOutline />
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
                className: 'custom-paper',
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
          </Box>
        </Grid>
      </Grid>
      <DialogCommon open={open} onClose={onClose} onConfirm={onConfirm} content={LOGOUT_CONTENT} />
    </Box>
  );
});

export default Header;
