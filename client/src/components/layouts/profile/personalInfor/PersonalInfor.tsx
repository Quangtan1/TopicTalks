import { FiberManualRecordTwoTone } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';
import { AiFillDelete, AiOutlineUserAdd } from 'react-icons/ai';
import { HiCamera } from 'react-icons/hi';
import friendStore from 'src/store/friendStore';
import { IUserProfile } from 'src/types/account.types';
import { avatar_default } from 'src/utils';
import { formatDate } from 'src/utils/helper';
import './PersonalInfor.scss';
import accountStore from 'src/store/accountStore';

interface IPersonalProps {
  user: IUserProfile;
  isDisplay: boolean;
  isProfile: boolean;
  setUpdateAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isFriend: boolean;
  isRequest: boolean;
  isAccept: boolean;
  accessChat: () => void;
  setOpenListFriend: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenConFirm: React.Dispatch<React.SetStateAction<boolean>>;
  acceptFriend: () => void;
  deleteFriend: () => void;
  addFriend: () => void;
}

const PersonalInfor = observer((props: IPersonalProps) => {
  const {
    user,
    isDisplay,
    isProfile,
    setUpdateAvatar,
    isFriend,
    setOpenEditProfile,
    accessChat,
    isRequest,
    isAccept,
    setOpenListFriend,
    setOpenConFirm,
    acceptFriend,
    deleteFriend,
    addFriend,
  } = props;

  const account = accountStore?.account;

  return (
    <Box className="partner_profile">
      <Box className="box_infor_first">
        <Box className="avt_image">
          <img src={user?.imageUrl || avatar_default} alt="avt" />

          {isProfile ? (
            <HiCamera className="update_image" onClick={() => setUpdateAvatar(true)} />
          ) : user?.active ? (
            <FiberManualRecordTwoTone className="online" />
          ) : (
            <FiberManualRecordTwoTone className="offline" />
          )}
        </Box>
        <Box className="info_user">
          <Box className="about_me">
            <Typography>{account.id === user?.id ? 'PROFILE' : 'ABOUT ME'}</Typography>
            <Typography>
              {`//`} {account.id === user?.id ? 'PROFILE' : 'ABOUT ME'}
            </Typography>
          </Box>
          <Box className="bio_box">
            <span className="box_name">
              <Typography className="user_name">{user?.username}</Typography>
              {isDisplay && user?.fullName && <Typography className="real_name">{`(${user?.fullName})`}</Typography>}
              {isDisplay && user?.bio && (
                <Typography className="bio">
                  <strong> Bio: </strong>
                  {user?.bio}
                </Typography>
              )}
            </span>
          </Box>
          <Box className="grid_container"></Box>
          <Box className="action_box">
            {isProfile ? (
              <Button onClick={() => setOpenEditProfile(true)}>Update Profile</Button>
            ) : (
              <Button onClick={accessChat}>Message</Button>
            )}
            {isProfile ? (
              <Button className="add_request" onClick={() => setOpenListFriend(true)}>
                List Friend
              </Button>
            ) : isFriend ? (
              <Button className="friend_request" onClick={() => setOpenConFirm(true)}>
                Your Friend
              </Button>
            ) : isRequest ? (
              isAccept ? (
                <Button className="accept_request" onClick={acceptFriend}>
                  <AiOutlineUserAdd />
                  Accept Friend
                </Button>
              ) : (
                <Button className="cancel_request" onClick={deleteFriend}>
                  <AiFillDelete /> Cancel Request
                </Button>
              )
            ) : (
              <Button onClick={addFriend} className="add_request">
                <AiOutlineUserAdd />
                Add Friend
              </Button>
            )}
          </Box>
          <Box className="contact_infor">
            <Box className="contact_infor_post">
              <Typography>{user?.totalNumOfPosts}</Typography>
              <Typography>
                <span>+</span> Posts
              </Typography>
            </Box>
            <Box className="contact_infor_post">
              <Typography>{user?.totalNumOfFriends}</Typography>
              <Typography>
                <span>+</span> Friends
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default PersonalInfor;
