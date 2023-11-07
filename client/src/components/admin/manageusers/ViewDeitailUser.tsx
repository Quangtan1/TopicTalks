import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React from 'react';
import { IUserProfile } from 'src/types/account.types';
import './ViewDetailUser.scss';
import { observer } from 'mobx-react';
import { formatDate } from 'src/utils/helper';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  user: IUserProfile;
}
const ViewDeitalUser = observer((props: DialogProps) => {
  const { open, onClose, user } = props;

  return (
    <Dialog open={open} onClose={onClose} className="dialog_view_user">
      <DialogTitle className="dialog_title">{user?.username} Information</DialogTitle>

      <DialogContent className="dialog_content">
        <Box className="infor">
          <Typography>Email:</Typography>
          <Typography>{user?.email || 'N/A'}</Typography>
        </Box>
        <Box className="infor">
          <Typography>Phone Number:</Typography>
          <Typography>{user?.phoneNumber || 'N/A'}</Typography>
        </Box>
        <Box className="infor">
          <Typography>Country:</Typography>
          <Typography>{user?.country || 'N/A'}</Typography>
        </Box>
        <Box className="infor">
          <Typography>Dob:</Typography>
          <Typography>{formatDate(user?.dob) || 'N/A'}</Typography>
        </Box>
        <Box className="infor">
          <Typography>Gender:</Typography>
          <Typography>{user?.gender || 'N/A'}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

export default ViewDeitalUser;
