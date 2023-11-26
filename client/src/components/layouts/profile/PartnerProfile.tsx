import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PartnerProfile.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { avatar_default, createAxios, deleteDataAPI, getDataAPI, logo, postDataAPI } from 'src/utils';
import { IUserProfile } from 'src/types/account.types';
import PostDetailDialog from '../home/community/posts/PostDetailDialog';
import { HiCamera, HiOutlineArrowRight } from 'react-icons/hi';
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
import { formatDate } from 'src/utils/helper';
import { FiberManualRecordTwoTone } from '@mui/icons-material';
import { RiDoubleQuotesL } from 'react-icons/ri';

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
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
    getDataAPI(`/post/all-posts/aid=${id}`, account.access_token, axiosJWT)
      .then((res) => {
        postItemStore?.setPosts(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
  }, [id]);

  const accessChat = () => {
    const dataRequest = {
      userIdInSession: account?.id,
      topicChildrenId: 1,
    };

    uiStore?.setLoading(true);
    postDataAPI(`/participant/${id}`, dataRequest, account.access_token, axiosJWT)
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
        uiStore?.setLoading(false);
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
        const newListFriends = friendStore?.friends?.filter((item) => item.friendListId !== res.data.data.friendListId);
        friendStore?.setFriends([...newListFriends, res.data.data]);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
  };

  const addFriend = () => {
    const friendData = {
      userId: account.id,
      friendId: id,
    };
    postDataAPI(`/friends/applyAddFriends`, friendData, account.access_token, axiosJWT)
      .then((res) => {
        friendStore?.friends !== null
          ? friendStore?.setFriends([...friendStore?.friends, res.data.data])
          : friendStore?.setFriends([res.data.data]);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
  };

  const handleDetailPost = (id: number) => {
    setOpenPostDetail(true);
    setPostId(id);
  };

  const friendListCustom = friendStore?.friends?.find(
    (item) =>
      (item.friendId === account.id || item.userid === account.id) &&
      (item.friendId === user?.id || item.userid === user?.id),
  );

  const userId = friendListCustom?.userid;
  const friendId = friendListCustom?.friendId;

  const deleteFriend = () => {
    deleteDataAPI(`/friends/rejectFriendsApply?uid=${userId}&fid=${friendId}`, account.access_token, axiosJWT)
      .then((res) => {
        const newListFriends = friendStore?.friends?.filter(
          (item) => item?.friendListId !== friendListCustom.friendListId,
        );
        friendStore?.setFriends(newListFriends);
        setOpenConFirm(false);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
  };

  const isProfile = account.id === user?.id;
  const isAccept =
    friendStore?.friends?.length > 0 && friendStore?.friends?.some((item) => item.userid === user?.id && !item.accept);
  const isRequest = friendStore?.friends?.some((item) => item.friendId === user?.id || item.userid === user?.id);
  const isFriend = friendStore?.friends?.some(
    (item) => (item.friendId === user?.id || item.userid === user?.id) && item.accept,
  );

  const postApproves = posts?.filter((item) => {
    if (account.id === item.author_id) {
      return item.approved;
    } else {
      return item.approved && (isFriend ? item.status !== 3 : item.status === 1);
    }
  });
  const postWaitingApproves = posts?.filter((item) => !item.approved);

  const isDisplay = isFriend || account?.id === user?.id;
  return (
    <Box className="partner-profile-container">
      <Box className="partner_profile">
        <Box className="avt_image">
          <div className="backgroud_image" />

          {!isDisplay ? (
            <img src={avatar_default} alt="avt" />
          ) : (
            <img src={user?.imageUrl || avatar_default} alt="avt" />
          )}

          {isProfile ? (
            <HiCamera className="update_image" onClick={() => setUpdateAvatar(true)} />
          ) : user?.active ? (
            <FiberManualRecordTwoTone className="online" />
          ) : (
            <FiberManualRecordTwoTone className="offline" />
          )}
        </Box>
        <Box className="info_user">
          <Box className="bio_box">
            <span className="box_name">
              <Typography className="title">Name :...</Typography>
              <Typography className="user_name">{user?.username}</Typography>
              <Typography className="real_name">{(isDisplay && `(${user?.fullName})`) || ''}</Typography>
            </span>
            <Typography className="title">Bio</Typography>
            {isDisplay && user?.bio !== '' ? (
              <Typography>{user?.bio}</Typography>
            ) : (
              <Typography className="bio_content_hidden">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx,</span>
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </Typography>
            )}
          </Box>
          <Grid container spacing={4} className="grid_container">
            <Grid item md={6}>
              <Typography className="title">Gender :...</Typography>
              <Typography className={(!isDisplay || !user?.gender) && 'content_hidden'}>
                {(isDisplay && user?.gender) || 'ZXZXX'}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Dob :...</Typography>
              <Typography className={(!isDisplay || formatDate(user?.dob) === '') && 'content_hidden'}>
                {(isDisplay && formatDate(user?.dob)) || 'XX YY ZZZZ'}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Phone :...</Typography>
              <Typography className={(!isDisplay || !user?.phoneNumber) && 'content_hidden'}>
                {' '}
                {(isDisplay && user?.phoneNumber) || 'XXX XXXX XXXX'}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Nationality :...</Typography>
              <Typography className={(!isDisplay || !user?.country) && 'content_hidden'}>
                {(isDisplay && user?.country) || 'ZXZXX'}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography className="title">Email :...</Typography>
              <Typography className={(!isDisplay || !user?.email) && 'content_hidden'}>
                {(isDisplay && user?.email) || 'ZXZXXXXXXXXXXXX'}
              </Typography>
            </Grid>
          </Grid>
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
        </Box>
      </Box>
      {isProfile && postWaitingApproves?.length > 0 && (
        <>
          <Box className="title_box">
            <Typography className="title_backgroud">Post</Typography>
            <Typography className="title_group">List of unapproved posts</Typography>
          </Box>
          <Box className="post_container">
            {postWaitingApproves?.map((item, index: number) => (
              <Box className={`card_post ${index % 2 === 0 ? 'image_right' : 'image_left'}`} key={item.id}>
                <img src={item.img_url} className="image" alt="img" />
                <Box className="box_card_content">
                  <RiDoubleQuotesL className="quotes" />
                  <Typography className="topic_name">{item.topicName},</Typography>
                  <Typography className="title">{item.title}</Typography>
                  <Typography className="date">
                    {formatDate(item.created_at)} / / {item.like.totalLike} LIKES && {item.totalComment} COMMENTS
                  </Typography>
                  <span>_________</span>
                  <Typography className="content">{item.content}</Typography>
                  <Button onClick={() => handleDetailPost(item.id)}>
                    Read More <HiOutlineArrowRight />
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
      <Box className="title_box">
        <Typography className="title_backgroud">
          {account.id !== user?.id ? 'SOME OF MY POST' : 'LIST OF YOUR POST'}
        </Typography>

        {postApproves?.length > 0 ? (
          <Typography className="title_group">
            {account.id !== user?.id ? 'Get to know me' : 'See details now'}
          </Typography>
        ) : (
          <Typography className="title_group">No posts exist</Typography>
        )}
      </Box>
      <Box className="post_container">
        {postApproves?.map((item, index: number) => (
          <Box className={`card_post ${index % 2 === 0 ? 'image_right' : 'image_left'}`} key={item.id}>
            <img src={item.img_url} className="image" alt="img" />
            <Box className="box_card_content">
              <RiDoubleQuotesL className="quotes" />
              <Typography className="topic_name">{item.topicName},</Typography>
              <Typography className="title">{item.title}</Typography>
              <Typography className="date">
                {formatDate(item.created_at)} / / {item.like.totalLike} LIKES && {item.totalComment} COMMENTS
              </Typography>
              <span>_________</span>
              <Typography className="content">{item.content}</Typography>
              <Button onClick={() => handleDetailPost(item.id)}>
                Read More <HiOutlineArrowRight />
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
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
