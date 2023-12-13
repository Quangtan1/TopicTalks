import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import './AvatarComponent.scss';
import dayjs from 'dayjs';

interface AvatarProps {
  url: string;
  username: string;
}

const AvatarComponent: React.FC<AvatarProps> = ({ url, username }) => {
  return (
    <Box className="avatar-container">
      {!!url ? (
        <img alt="avatar" src={url} width={50} height={50} className="avatar" />
      ) : (
        <Avatar
          sx={{
            width: 32,
            height: 32,
          }}
          src={url}
          alt="avatar"
        />
      )}
      <Box marginLeft={2}>
        <Typography variant="subtitle1" className="username">
          {username}
        </Typography>
        <Typography variant="body2" className="topic-tag">
          {dayjs(new Date()).format('DD/MM/YYYY')}
        </Typography>
      </Box>
    </Box>
  );
};

export default AvatarComponent;
