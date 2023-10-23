import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PartnerProfile.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { createAxios, deleteDataAPI, getDataAPI, logo, postDataAPI } from 'src/utils';
import { IUserProfile } from 'src/types/account.types';
import PostDetailDialog from '../home/community/posts/PostDetailDialog';
import { HiCamera } from 'react-icons/hi';
import uiStore from 'src/store/uiStore';
import chatStore from 'src/store/chatStore';
import friendStore from 'src/store/friendStore';
import { AiFillDelete, AiOutlineUserAdd } from 'react-icons/ai';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import ListFriendDialog from './listfriend/ListFriendDialog';
import SelectTopicMessage from 'src/components/dialogs/SelectTopicMessage';
import { TopicChild } from 'src/types/topic.type';
import postItemStore from 'src/store/postStore';
import EditProfileModal from './editProfileModal';
import AvatarDialog from './avatar/AvatarDialog';

const PartnerProfile = observer(() => {
  const { id } = useParams();
  const [user, setUser] = useState<IUserProfile>(null);
  const [openPostDetail, setOpenPostDetail] = useState<boolean>(false);
  const [postId, setPostId] = useState<number>();
  const [openConfirm, setOpenConFirm] = useState<boolean>(false);
  const [openListFriend, setOpenListFriend] = useState<boolean>(false);
  const [openSelectTopic, setOpenSelectTopic] = useState<boolean>(false);
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const [openUpdateAvatar, setUpdateAvatar] = useState<boolean>(false);
  const navigate = useNavigate();
  const content = `Cancel Friend with ${user?.username} ?`;

  const posts = postItemStore?.posts;
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`/user/${id}`, account.access_token, axiosJWT)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getDataAPI(`/post/all-posts/aid=${id}`, account.access_token, axiosJWT)
      .then((res) => {
        postItemStore?.setPosts(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const accessChat = (topic: TopicChild) => {
    const dataRequest = {
      userIdInSession: account.id,
      topicChildrenId: topic.id,
    };
    uiStore?.setLoading(true);
    postDataAPI(`/participant/${user?.id}`, dataRequest, account.access_token, axiosJWT)
      .then((res) => {
        navigate('/message');
        setTimeout(() => {
          const result = chatStore?.chats.some(
            (item) => item.conversationInfor.id === res.data.data.conversationInfor.id,
          );
          if (result) {
            chatStore?.setSelectedChat(res.data.data);
          } else {
            chatStore?.setChats([res.data.data, ...chatStore?.chats]);
            chatStore?.setSelectedChat(res.data.data);
          }
          uiStore?.setLoading(false);
        }, 200);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const acceptFriend = () => {
    const dataRequest = {
      userId: user?.id,
      friendId: account.id,
    };
    postDataAPI(`/friends/acceptFriendsApply`, dataRequest, account.access_token, axiosJWT)
      .then((res) => {
        const newListFriends = friendStore?.friends.filter((item) => item.friendListId !== res.data.data.friendListId);
        friendStore?.setFriends([...newListFriends, res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postApproves = posts?.filter((item) => item.approved);
  const postWaitingApproves = posts?.filter((item) => !item.approved);

  const addFriend = () => {
    const friendData = {
      userId: account.id,
      friendId: id,
    };
    postDataAPI(`/friends/applyAddFriends`, friendData, account.access_token, axiosJWT)
      .then((res) => {
        friendStore?.setFriends([...friendStore?.friends, res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDetailPost = (id: number) => {
    setOpenPostDetail(true);
    setPostId(id);
  };

  const friendListCustom = friendStore?.friends.find(
    (item) =>
      (item.friendId === account.id || item.userid === account.id) &&
      (item.friendId === user?.id || item.userid === user?.id),
  );

  const deleteFriend = () => {
    // const inforRerquest = friendStore?.friends.filter(
    //   (item) =>
    //     (item.friendId === account.id || item.userid === account.id) &&
    //     (item.friendId === user?.id || item.userid === user?.id),
    // );
    const userId = friendListCustom.userid;
    const friendId = friendListCustom.friendId;

    deleteDataAPI(`/friends/rejectFriendsApply?uid=${userId}&fid=${friendId}`, account.access_token, axiosJWT)
      .then((res) => {
        const newListFriends = friendStore?.friends.filter(
          (item) => item?.friendListId !== friendListCustom.friendListId,
        );
        friendStore?.setFriends(newListFriends);
        setOpenConFirm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isProfile = account.id === user?.id;
  const isAccept =
    friendStore?.friends.length > 0 && friendStore?.friends.some((item) => item.userid === user?.id && !item.accept);
  const isRequest = friendStore?.friends.some((item) => item.friendId === user?.id || item.userid === user?.id);
  const isFriend = friendStore?.friends.some(
    (item) => (item.friendId === user?.id || item.userid === user?.id) && item.accept,
  );

  return (
    <Box className="partner-profile-container">
      <Box className="title_box">
        <Typography className="title_backgroud">Profile</Typography>
        <Typography className="title_group">
          <strong>{isProfile ? 'My' : user?.username}</strong> Profile
        </Typography>
      </Box>
      <Box className="partner_profile">
        <Box className="avt_image">
          <div className="backgroud_image" />
          <img src={user?.imageUrl || logo} alt="avt" />
          {isProfile && <HiCamera className="update_image" onClick={() => setUpdateAvatar(true)} />}
        </Box>
        <Box className="info_user">
          <Box className="bio_box">
            <Typography className="title">Bio</Typography>
            {user?.bio !== '' ? (
              <Typography>{user?.bio}</Typography>
            ) : (
              <Typography>
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx,
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxx
              </Typography>
            )}
          </Box>
          <Grid container spacing={4} className="grid_container">
            <Grid item md={6}>
              <Typography className="title">Age :...</Typography>
              <Typography>ZX</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Dob :...</Typography>
              <Typography>{user?.dob || 'XX YY ZZZZ'}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Phone :...</Typography>
              <Typography>XXX XXXX XXXX</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Nationality :...</Typography>
              <Typography>{user?.country || 'ZXZXX'}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Email :...</Typography>
              <Typography>{user?.email || 'ZXZXX'}</Typography>
            </Grid>
          </Grid>
          <Box className="action_box">
            {isProfile ? (
              <Button onClick={() => setOpenEditProfile(true)}>Update Profile</Button>
            ) : (
              <Button onClick={() => setOpenSelectTopic(true)}>Message</Button>
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
        </Box>
      </Box>
      {isProfile && (
        <>
          <Box className="title_box">
            <Typography className="title_backgroud">Post</Typography>
            <Typography className="title_group">
              <strong>Wating </strong>Approve
            </Typography>
          </Box>
          <Grid className="post_container" container spacing={4}>
            {postWaitingApproves?.map((item) => (
              <Grid md={4} item key={item.id}>
                <Card className="card_post">
                  <CardMedia image={item.img_url} className="image" />
                  <CardContent className="card_content">
                    <Typography>{item.title}</Typography>
                    <Typography>{item.content}</Typography>
                  </CardContent>
                  <CardActions className="card_action">
                    <Button onClick={() => handleDetailPost(item.id)}>More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      <Box className="title_box">
        <Typography className="title_backgroud">Post</Typography>
        <Typography className="title_group">
          <strong>All</strong> Posts
        </Typography>
      </Box>
      <Grid className="post_container" container spacing={4}>
        {postApproves?.map((item) => (
          <Grid md={4} item key={item.id}>
            <Card className="card_post">
              <CardMedia image={item.img_url} className="image" />
              <CardContent className="card_content">
                <Typography>{item.title}</Typography>
                <Typography>{item.content}</Typography>
              </CardContent>
              <CardActions className="card_action">
                <Button onClick={() => handleDetailPost(item.id)}>More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {openPostDetail && (
        <PostDetailDialog open={openPostDetail} onClose={() => setOpenPostDetail(false)} postId={postId} />
      )}
      {openConfirm && (
        <DialogCommon
          open={openConfirm}
          onClose={() => setOpenConFirm(false)}
          onConfirm={deleteFriend}
          content={content}
        />
      )}
      {openListFriend && <ListFriendDialog open={openListFriend} onClose={() => setOpenListFriend(false)} />}
      {openSelectTopic && (
        <SelectTopicMessage open={openSelectTopic} onClose={() => setOpenSelectTopic(false)} onConfirm={accessChat} />
      )}
      {openEditProfile && (
        <EditProfileModal
          isOpen={openEditProfile}
          handleClose={() => setOpenEditProfile(false)}
          userInfor={user}
          setUserInfor={setUser}
        />
      )}
      {openUpdateAvatar && (
        <AvatarDialog
          open={openUpdateAvatar}
          onClose={() => setUpdateAvatar(false)}
          userInfor={user}
          setUserInfor={setUser}
        />
      )}
    </Box>
  );
});

export default PartnerProfile;
