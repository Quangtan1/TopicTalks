import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { IUserProfile } from 'src/types/account.types';
import './DialogBanUser.scss';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { createAxios, postDataAPI, putDataAPI } from 'src/utils';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
const dataBan = [
  {
    id: 0,
    num: 5,
  },
  {
    id: 1,
    num: 15,
  },
  {
    id: 2,
    num: 30,
  },
];
interface DialogProps {
  isBan: boolean;
  open: boolean;
  onClose: () => void;
  user: IUserProfile;
  listUser: IUserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<IUserProfile[]>>;
}
const DialogBanUser = observer((props: DialogProps) => {
  const { open, onClose, user, setUsers, listUser, isBan } = props;
  const [selectDayBan, setSelectDayBan] = useState<number>(5);
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleBan = () => {
    putDataAPI(`/user/ban?id=${user?.id}&&num=${selectDayBan}`, null, account.access_token, axiosJWT)
      .then((res) => {
        setUsers(() => {
          return listUser?.map((prevUser) => {
            if (prevUser.id === user?.id) {
              return {
                ...prevUser,
                banned: true,
              };
            }
            return prevUser;
          });
        });
        ToastSuccess('Ban User Successfully!!!');
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnBan = () => {
    postDataAPI(`/user/unban/${user?.id}`, null, account.access_token, axiosJWT)
      .then((res) => {
        setUsers(() => {
          return listUser?.map((prevUser) => {
            if (prevUser.id === user?.id) {
              return {
                ...prevUser,
                banned: false,
              };
            }
            return prevUser;
          });
        });
        ToastSuccess('Unban User Successfully!!!');
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Dialog open={open} onClose={onClose} className="dialog_ban_user">
      <DialogTitle className="dialog_title">
        {isBan ? 'Ban' : 'UnBan'} {user?.username}
      </DialogTitle>
      <DialogContent className="dialog_content">
        {!isBan ? (
          <Typography className="unban">Do you want to unban {user?.username}?</Typography>
        ) : (
          <Box className="select_ban_date">
            <Typography>Select Ban Date</Typography>
            <Select value={selectDayBan} onChange={(e: any) => setSelectDayBan(e.target.value)} fullWidth>
              {dataBan.map((item) => (
                <MenuItem value={item.num} key={item.id}>
                  {item.num} Days
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        <Box className="warning">
          <MdOutlineErrorOutline />
          <Typography>Reviewing user suspension for system rule violation.</Typography>
        </Box>
      </DialogContent>
      <DialogActions className="dialog_action">
        <Button onClick={onClose}>Cancel</Button>
        {isBan ? <Button onClick={handleBan}>Ban</Button> : <Button onClick={handleUnBan}>UnBan</Button>}
      </DialogActions>
    </Dialog>
  );
});

export default DialogBanUser;
