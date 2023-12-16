import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import accountStore from 'src/store/accountStore';
import friendStore from 'src/store/friendStore';
import './ListFriendDialog.scss';
import { CiSearch } from 'react-icons/ci';
import { IFriends } from 'src/types/account.types';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { createAxios, deleteDataAPI, postDataAPI } from 'src/utils';
import { ToastSuccess } from 'src/utils/toastOptions';
import DialogCommon from 'src/components/dialogs/DialogCommon';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}
const ListFriendDialog = observer((props: DialogProps) => {
  const { open, onClose } = props;
  const [active, setActive] = useState<number>(0);
  const [dataTabFriend, setDataTabFriend] = useState<IFriends[]>([]);
  const [filteredDataTabFriend, setFilteredDataTabFriend] = useState<IFriends[]>([]);
  const [search, setSearch] = useState<string>('');
  const [openConfirm, setOpenConFirm] = useState<boolean>(false);
  const [friendIdCustom, setFriendIdCustom] = useState<number>();
  const [friendNameCustom, setFriendNameCustom] = useState<string>('');
  const [listFriendIdCustom, setListFriendIdCustom] = useState<number>();
  const friends = friendStore?.friends;
  const navigate = useNavigate();

  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const listFriend = friends?.filter((item) => item.accept);
  const listRequest = friends?.filter((item) => !item.accept && account.id === item.friendId);
  // const isFriend = listFriend?.some((item) => item.userid === account.id);

  const acceptFriend = (friendId: number, friendName: string, friendListId: number) => {
    const dataRequest = {
      userId: friendId,
      friendId: account.id,
    };
    postDataAPI(`/friends/acceptFriendsApply`, dataRequest, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess(`You and ${friendName} are friends now`);
        const newData = filteredDataTabFriend.filter((item) => item.friendListId !== friendListId);
        setFilteredDataTabFriend(newData);
        const newListFriends = friendStore?.friends.filter((item) => item.friendListId !== res.data.data.friendListId);
        friendStore?.setFriends([...newListFriends, res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (active === 0) {
      setDataTabFriend(listFriend);
    } else {
      setDataTabFriend(listRequest);
    }
  }, [active]);

  useEffect(() => {
    if (search !== '' && dataTabFriend !== undefined) {
      const filteredFriends = dataTabFriend.filter((item) =>
        item.userName.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredDataTabFriend(filteredFriends);
    } else {
      setFilteredDataTabFriend(dataTabFriend);
    }
  }, [search, dataTabFriend]);

  const handleNavigate = (id: number) => {
    navigate(`/personal-profile/${id}`);
    onClose();
  };

  const deleteFriend = (fId: number, friendName: string, friendListId: number) => {
    const friendListCustom = friendStore?.friends.find(
      (item) =>
        (item.friendId === account.id || item.userid === account.id) && (item.friendId === fId || item.userid === fId),
    );
    const userId = friendListCustom.userid;
    const friendId = friendListCustom.friendId;

    deleteDataAPI(`/friends/rejectFriendsApply?uid=${userId}&fid=${friendId}`, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess(`You just ${active === 0 ? 'Delete' : 'cancel Request of'}  ${friendName}`);
        const newData = filteredDataTabFriend?.filter((item) => item.friendListId !== friendListId);
        setFilteredDataTabFriend(newData);
        const newListFriends = friendStore?.friends?.filter((item) => item?.friendListId !== friendListId);
        friendStore?.setFriends(newListFriends);
        setOpenConFirm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirm = (fId: number, friendName: string, friendListId: number) => {
    setFriendIdCustom(fId);
    setFriendNameCustom(friendName);
    setListFriendIdCustom(friendListId);
    setOpenConFirm(true);
  };

  const content = `Do you want to ${active === 0 ? 'delete' : 'cancel request of'} ${friendNameCustom}`;
  return (
    <Dialog open={open} onClose={onClose} className="list_friend_container">
      <DialogTitle className="dialog_title">
        List Friends <AiOutlineClose onClick={onClose} />
      </DialogTitle>

      <DialogContent className="dialog_content">
        <TextField
          placeholder="Search..."
          className="search"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CiSearch />
              </InputAdornment>
            ),
          }}
        />
        <Box className="tab_option">
          <Typography className={active === 0 && 'selected'} onClick={() => setActive(0)}>
            Friends
          </Typography>
          <Typography className={active === 1 && 'selected'} onClick={() => setActive(1)}>
            Request
          </Typography>
        </Box>
        {filteredDataTabFriend?.length === 0 || filteredDataTabFriend === undefined ? (
          <Typography className="not_data">Not have {active === 0 ? 'Friend' : 'Request'}</Typography>
        ) : (
          <Box className="box_friend_container">
            {filteredDataTabFriend?.map((item) => (
              <Box className="box_friends">
                <Box className="friend_infor">
                  <Avatar
                    src={item.userid === account.id ? item.friendUrl : item.userUrl}
                    onClick={() => handleNavigate(item.userid === account.id ? item.friendId : item.userid)}
                  />
                  <Typography onClick={() => handleNavigate(item.userid === account.id ? item.friendId : item.userid)}>
                    {item.userid === account.id ? item.friendName : item.userName}
                  </Typography>
                </Box>
                <Box className="option_action">
                  {active === 1 && (
                    <Button
                      className="accept"
                      onClick={() =>
                        acceptFriend(
                          item.userid === account.id ? item.friendId : item.userid,
                          item.userid === account.id ? item.friendName : item.userName,
                          item.friendListId,
                        )
                      }
                    >
                      Accept
                    </Button>
                  )}
                  <Button
                    className="cancel_request"
                    onClick={() =>
                      handleConfirm(
                        item.userid === account.id ? item.friendId : item.userid,
                        item.userid === account.id ? item.friendName : item.userName,
                        item.friendListId,
                      )
                    }
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      {openConfirm && (
        <DialogCommon
          open={openConfirm}
          onClose={() => setOpenConFirm(false)}
          onConfirm={() => deleteFriend(friendIdCustom, friendNameCustom, listFriendIdCustom)}
          content={content}
        />
      )}
    </Dialog>
  );
});

export default ListFriendDialog;
