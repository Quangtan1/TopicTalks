import { Box, Button, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PartnerProfile.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { createAxios, deleteDataAPI, getDataAPI, logo, postDataAPI } from 'src/utils';
import { IUserProfile } from 'src/types/account.types';
import PostDetailDialog from '../home/community/posts/PostDetailDialog';
import { HiOutlineArrowRight } from 'react-icons/hi';
import uiStore from 'src/store/uiStore';
import chatStore from 'src/store/chatStore';
import friendStore from 'src/store/friendStore';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import ListFriendDialog from './listfriend/ListFriendDialog';
import postItemStore from 'src/store/postStore';
import AvatarDialog from './avatar/AvatarDialog';
import { formatDatePost } from 'src/utils/helper';
import { RiDoubleQuotesL, RiLoader2Line } from 'react-icons/ri';
import PersonalInfor from './personalInfor/PersonalInfor';
import InforBox from './inforBox/InforBox';
import { CiCamera, CiLock } from 'react-icons/ci';
import { MdOutlineErrorOutline } from 'react-icons/md';
import EditProfileFullScreenDialog from './editProfileFullScreenDialog';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { IoIosApps } from 'react-icons/io';

export function extractNamesAndIds(inputString) {
  const regex = /\@\[([^\]]+)\]\((\d+)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    const name = match[1];
    const id = match[2];
    matches.push({ name, id });
  }

  return matches;
}

export const handleTitle = (title = '', handleNavigateToFriendPage) => {
  const regex = /(.+?)#(.+)/;
  const match = title.match(regex);

  if (match) {
    const postDataTitle = match[1].trim();
    const friendsMention = match[2].trim();
    const mentions = extractNamesAndIds(friendsMention);
    return (
      <>
        <Typography className="mention" sx={{ display: 'flex', textAlign: 'center' }}>
          <Typography
            sx={{
              color: 'rgb(142, 110, 81)',
              textTransform: 'capitalize',
              fontFamily: 'Yeseva One',
              fontWeight: '600',
            }}
          >
            Enjoying with:
          </Typography>
          {mentions?.map((item) => (
            <Box
              sx={{
                margin: '0px 4px',
                overflowWrap: 'break-word',
                padding: '2px 4px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{ cursor: 'pointer', textAlign: 'center', overflowWrap: 'break-word' }}
                variant="body2"
                color={'seagreen'}
                onClick={() => handleNavigateToFriendPage(item?.id)}
              >
                {item?.name}
              </Typography>
            </Box>
          ))}
        </Typography>
        <Typography className="title">{postDataTitle}</Typography>
      </>
    );
  }

  return <Typography className="title">{title}</Typography>;
};

const PartnerProfile = observer(() => {
  const { id } = useParams();
  const [user, setUser] = useState<IUserProfile>(null);
  const [openPostDetail, setOpenPostDetail] = useState<boolean>(false);
  const [postId, setPostId] = useState<number>();
  const [openConfirm, setOpenConFirm] = useState<boolean>(false);
  const [openListFriend, setOpenListFriend] = useState<boolean>(false);
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const [openUpdateAvatar, setUpdateAvatar] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  const [isLoadPost, setIsLoadPost] = useState<boolean>(false);
  const [isTabAprrove, setIsTabAprrove] = useState<boolean>(true);
  const navigate = useNavigate();
  const content = `Cancel Friend with ${user?.username} ?`;

  const posts = postItemStore?.posts;
  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const total = scrollHeight - windowHeight;
    if (scrollTop >= total && total > 0) {
      setPage((prePage) => prePage + 1);
    }
  };

  const fetchApi = (page: number, id: string, isTabAprrove: boolean) => {
    return getDataAPI(
      `/post/all-posts/aid=${id}?isApproved=${isTabAprrove}&page=${page}&size=5`,
      account.access_token,
      axiosJWT,
    );
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    setIsLoadPost(true);
    getDataAPI(`/user/${id}`, account.access_token, axiosJWT)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    fetchApi(0, id, isTabAprrove)
      .then((res) => {
        postItemStore?.setPosts(res.data.data.content);
        const lengthData = res.data.data.content.length;
        (lengthData === 0 || lengthData < 5) && setIsLast(false);
        setIsLoadPost(false);
      })
      .catch((err) => {
        setIsLoadPost(false);
        console.log(err);
      });
    return () => {
      setIsLast(true);
      setPage(0);
      window.removeEventListener('scroll', handleScroll);
      postItemStore?.setPosts([]);
    };
  }, [id, isTabAprrove]);

  useEffect(() => {
    if (page !== 0 && isLast) {
      setIsLoadPost(true);
      fetchApi(page, id, isTabAprrove)
        .then((res) => {
          const newPosts = res.data.data.content;
          postItemStore?.setPosts([...postItemStore?.posts, ...newPosts]);
          const lengthData = res.data.data.content.length;
          (lengthData === 0 || lengthData < 5) && setIsLast(false);
          setIsLoadPost(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoadPost(false);
        });
    }
  }, [page, id]);

  useEffect(() => {
    return () => {
      setIsTabAprrove(true);
    };
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
      return item;
    } else {
      return item.approved && (isFriend ? item.status !== 3 : item.status === 1);
    }
  });

  const isDisplay = (isFriend && !user?.public) || account?.id === user?.id;

  const handleNavigateToFriendPage = (friendId: number) => {
    navigate(`/personal-profile/${friendId}`);
  };

  return (
    <Box className="partner-profile-container">
      <Box className="box_detail_infor_container">
        <Box className="box_first">
          <InforBox user={user} isDisplay={isDisplay} />
        </Box>
        <Box className="box_container">
          <PersonalInfor
            user={user}
            isDisplay={isDisplay}
            isProfile={isProfile}
            setUpdateAvatar={setUpdateAvatar}
            setOpenEditProfile={setOpenEditProfile}
            isFriend={isFriend}
            isAccept={isAccept}
            isRequest={isRequest}
            accessChat={accessChat}
            setOpenListFriend={setOpenListFriend}
            setOpenConFirm={setOpenConFirm}
            acceptFriend={acceptFriend}
            deleteFriend={deleteFriend}
            addFriend={addFriend}
          />

          {isDisplay ? (
            <>
              {isDisplay && (
                <Box className="title_box">
                  <Box className="tab_option">
                    <Button className={isTabAprrove && 'selected'} onClick={() => setIsTabAprrove(true)}>
                      <BsGrid3X3Gap /> POSTS
                    </Button>
                    {account?.id === user?.id && (
                      <Button className={!isTabAprrove && 'selected'} onClick={() => setIsTabAprrove(false)}>
                        <IoIosApps /> Pending
                      </Button>
                    )}
                  </Box>
                </Box>
              )}

              {postApproves?.length > 0 ? (
                <Box className="post_container">
                  {postApproves?.map((item, index: number) => (
                    <Box className={`card_post ${index % 2 === 0 ? 'image_right' : 'image_left'}`} key={item.id}>
                      {!item.img_url ? (
                        <Skeleton className="image" animation={false} variant="rectangular" />
                      ) : (
                        <img src={item.img_url} className="image" alt="img" loading="lazy" />
                      )}
                      <Box className="box_card_content">
                        <RiDoubleQuotesL className="quotes" />

                        <Typography className="topic_name">{item.topicName},</Typography>
                        {handleTitle(item.title, handleNavigateToFriendPage)}

                        <Typography className="date">
                          {formatDatePost(item.created_at)} / / {item.like.totalLike} LIKES && {item.totalComment}{' '}
                          COMMENTS
                        </Typography>
                        <span>_________</span>
                        {item?.rejected && (
                          <Typography className="reject">
                            <MdOutlineErrorOutline />
                            {item?.reasonRejected}
                          </Typography>
                        )}
                        <Typography className="content">{item.content}</Typography>
                        <Button onClick={() => handleDetailPost(item.id)}>
                          Read More <HiOutlineArrowRight />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                  {isLoadPost && (
                    <Box className="load_post">
                      <RiLoader2Line />
                    </Box>
                  )}
                </Box>
              ) : account?.id === user?.id ? (
                <Box className="post_container">
                  <Box className="no_data">
                    <CiCamera />
                    <Typography className="title">{isTabAprrove ? 'Share Post' : 'No Post Pending Now'}</Typography>
                    <Typography>When you share posts, they will appear on your profile.</Typography>
                  </Box>
                </Box>
              ) : (
                <Box className="not_yet_data_container">
                  <Box className="not_yet_data">
                    <CiCamera />
                    <Typography className="title">No Posts Yet</Typography>
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Box className="not_display">
              {!user?.public ? (
                <Box className="not_friends">
                  <CiLock />
                  <Typography>
                    This Account is <strong>Private</strong>
                  </Typography>
                  <Typography>Be friend to see their posts</Typography>
                </Box>
              ) : (
                <Box className="not_friends">
                  <CiLock />
                  <Typography>
                    This account has been set up <strong>Anonymous</strong> mode
                  </Typography>
                  <Typography>you won't be able to view any personal details</Typography>
                  <Typography>from the user.</Typography>
                </Box>
              )}
              <Box />
            </Box>
          )}
        </Box>
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
        <EditProfileFullScreenDialog
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
