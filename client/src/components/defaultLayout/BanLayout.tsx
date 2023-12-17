import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { banImage } from 'src/utils';
import './BanLayout.scss';
import accountStore from 'src/store/accountStore';
import { observer } from 'mobx-react';
import { formatDate } from 'src/utils/helper';
import { useNavigate } from 'react-router-dom';

const BanLayout = observer(() => {
  const account = accountStore?.account;
  const navigate = useNavigate();
  return (
    <Box className="ban_view_layout">
      <img loading="lazy" src={banImage} alt="ban" />
      <Box className="warning_box">
        <Typography>Warning</Typography>
        <Typography>Your account has been disabled due to violation of the system's rules.</Typography>
        <Typography>
          The effective period of the ban is from the <strong>{formatDate(account?.bannedDate)}</strong> to the
          <strong> {formatDate(account?.dueDateUnBan)}</strong>.
        </Typography>
        <Box className="button_action">
          <Button onClick={() => navigate('/landing-view')}>Landing Page</Button>
          <Button onClick={() => navigate('/auth')}>Other Account</Button>
        </Box>
      </Box>
    </Box>
  );
});

export default BanLayout;
