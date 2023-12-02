import { Box, Typography } from '@mui/material';
import React from 'react';
import { IUserProfile } from 'src/types/account.types';
import { formatDate } from 'src/utils/helper';

interface IInforProps {
  user: IUserProfile;
  isDisplay: boolean;
}
const InforBox = (props: IInforProps) => {
  const { user, isDisplay } = props;
  return (
    <Box className="infor_box_container">
      <Box className="infor_item">
        <Typography>Date of birth: </Typography>
        <Typography>{(isDisplay && formatDate(user?.dob)) || 'N/A'}</Typography>
      </Box>
      <Box className="infor_item">
        <Typography>Phone Number: </Typography>
        <Typography>{(isDisplay && user?.phoneNumber) || 'N/A'}</Typography>
      </Box>
      <Box className="infor_item">
        <Typography>Gender: </Typography>
        <Typography>{(isDisplay && user?.gender) || 'N/A'}</Typography>
      </Box>
      <Box className="infor_item">
        <Typography>Country: </Typography>
        <Typography>{(isDisplay && user?.country) || 'N/A'}</Typography>
      </Box>
      <Box className="infor_item">
        <Typography>Email: </Typography>
        <Typography>{(isDisplay && user?.email) || 'N/A'}</Typography>
      </Box>
    </Box>
  );
};

export default InforBox;
