import React, { useState } from 'react';
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
import { headerRoute } from '../../../utils/consts';
import { RiSearchLine } from 'react-icons/ri';
import { HiOutlineSun } from 'react-icons/hi';
import { BiGroup } from 'react-icons/bi';
import { IoMailUnreadOutline, IoNotificationsOutline } from 'react-icons/io5';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(false);
  };

  const handleLogOut = () => {
    const result = window.confirm('Bạn có chắc là muốn đăng xuất chứ');
    if (result) {
      setAnchorEl(false);
      navigate('/');
    }
  };
  return (
    <Box className="header-container">
      <Grid container>
        <Grid item md={7} className="header-bar">
          {headerRoute.map((route, index) => (
            <Typography key={index}>{route.title}</Typography>
          ))}
        </Grid>
        <Grid item md={5} className="info-bar">
          <TextField
            required
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RiSearchLine />
                </InputAdornment>
              ),
            }}
            autoFocus
            className="search"
          />
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
                //   src={accountStore.account?.avatar}
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
                  <Avatar />
                </ListItemIcon>
                Trang cá nhân
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogOut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
