import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IComment,
  IPost,
  deleteComment,
  deletePost,
  useGetAllComment,
  useGetAllPosts,
  useGetCommentByPostId,
  useGetPostById,
  useGetUserById,
} from 'src/queries';
import accountStore from 'src/store/accountStore';
import { createAxios } from 'src/utils';
import { Box, Grid, Typography, Button, Card, CardContent, CardMedia, Avatar } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './styles.scss';
import { AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { BsShare } from 'react-icons/bs';
import ActionModal from '../post/actionModal/ActionModal';
import { Actions, actionsMenu } from '../post/actionModal/helpers';
import { useMutation } from 'react-query';
import { useEffect, useState } from 'react';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import NewPost from '../newPost/NewPost';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { DELETE_POST } from '../post/postHeader';
import Loading from 'src/components/loading/Loading';

// const comments = [
//   {
//     id: 1,
//     username: 'User1',
//     avatarUrl:
//       'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
//     created_at: '2023-09-30T10:00:00Z',
//     content: 'This is the first comment. Great post!',
//     likeCount: 5,
//   },
//   {
//     id: 2,
//     username: 'User2',
//     avatarUrl:
//       'https://us.123rf.com/450wm/photochicken/photochicken2008/photochicken200800065/153425631-pritty-young-asian-photographer-girl-teen-travel-with-camera-trip-take-a-photo-tourist-lifestyle.jpg?ver=6',
//     created_at: '2023-09-30T11:15:00Z',
//     content: 'Nice work! I enjoyed reading this.',
//     likeCount: 8,
//   },
//   {
//     id: 3,
//     username: 'User3',
//     avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
//     created_at: '2023-09-30T12:30:00Z',
//     content: `Thanks for sharing this. It's very informative!`,
//     likeCount: 12,
//   },
// ];

const PostDetail = observer(() => {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  dayjs.extend(relativeTime);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    refetchPostDetail();
    refetchUserById();
    scrollToTop();
    refetchCommentByPostId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================Config mobx==========================
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const axiosJWT = createAxios(account, setAccount);

  // ==========================State==========================
  const [open, setOpen] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // ========================== Query==========================
  const useDeletePost = useMutation((id: number) => deletePost(id, account));

  const useDeleteComment = useMutation((commentId: number) => deleteComment(commentId, account));

  const { refetch: refetchAllPost } = useGetAllPosts(account, setAccount);

  const { data: postDetail, refetch: refetchPostDetail, isLoading } = useGetPostById(+id, axiosJWT, account);

  const { title, content, img_url, author_id, created_at } = (postDetail as IPost) || {};

  const {
    data: userDetailData,
    isLoading: isLoadingUserDetail,
    refetch: refetchUserById,
  } = useGetUserById(author_id, axiosJWT, account);

  // TODO: change to useGetCommentByPostId
  // const { data: allCommentData, refetch: refetchCommentByPostId } = useGetCommentByPostId(+id, axiosJWT, account);
  const {
    data: allCommentData,
    isLoading: isLoadingComments,
    refetch: refetchCommentByPostId,
  } = useGetAllComment(axiosJWT, account);
  const timeAgo = dayjs(created_at)?.fromNow();

  const handleDeletePost = async (postId: number) => {
    try {
      const result = await useDeletePost.mutateAsync(postId);
      if (result.status === 200) {
        ToastSuccess('Delete post successfully!');
        refetchAllPost();
        navigate('/community');
      }
    } catch (error) {
      ToastError('Error deleting post!');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const result = await useDeleteComment.mutateAsync(commentId);
      if (result.status === 200) {
        ToastSuccess('Delete comment successfully!');
        setOpen(!open);
        refetchPostDetail();
        refetchCommentByPostId();
      }
    } catch (error) {
      ToastError('Error deleting comment!');
    }
  };

  const handleActions = (action: Actions) => {
    switch (action) {
      case Actions.Edit:
        setIsEdit(!isEdit);
        break;
      case Actions.Delete:
        setOpen(!open);
        break;
      default:
        break;
    }
  };

  const handleActionsComments = (action: Actions, commentId: number) => {
    switch (action) {
      case Actions.Edit:
        break;
      case Actions.Delete:
        setCommentId(commentId);
        setOpen(!open);
        break;
      default:
        break;
    }
  };

  return isLoading || isLoadingUserDetail || isLoadingComments ? (
    <>
      <Loading />
    </>
  ) : (
    <Grid container spacing={2} className="post-dt-container">
      {/* Left Side */}
      <Grid item xs={7} className="left-side">
        <Card className="post-dt-header">
          <CardContent className="post-dt-cardHeader">
            <Box className={'item1'}>
              <Typography variant="h6" className="post-dt-cardHeader-title" gutterBottom>
                {userDetailData?.username}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                {`Posted ${timeAgo}`}
              </Typography>
            </Box>
            <Box className={'item2'}>
              <Button className="item2-btn" variant="outlined" color="primary">
                <AiOutlineHeart />
              </Button>
              <Button className="item2-btn" variant="outlined" color="primary">
                <AiOutlineComment />
              </Button>
              <Button className="item2-btn" variant="outlined" color="primary">
                <BsShare />
              </Button>
              <Box sx={{ cursor: 'pointer' }}>
                <ActionModal actionsMenu={actionsMenu} onClick={handleActions} />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardMedia component="img" height="300" image={img_url} alt={title} />
          <CardContent>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {content}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Side */}
      <Grid item xs={5} className="right-side">
        <Card>
          <CardContent>
            <Typography className="title-comments" variant="h6" gutterBottom>
              Comments ({allCommentData?.length})
            </Typography>

            {isLoadingComments ? (
              <Loading />
            ) : (
              allCommentData.length !== 0 &&
              allCommentData?.map((comment: IComment) => {
                return (
                  <Box key={comment?.id} className={'itemComments'}>
                    <Box className="userGroup">
                      <Box className="userAvatarGroup">
                        <Avatar src={userDetailData?.imageUrl} alt={comment?.username} />
                        <Typography variant="subtitle1" className="userName">
                          {comment?.username}
                        </Typography>
                      </Box>
                      <Box>
                        <ActionModal
                          actionsMenu={actionsMenu}
                          onClick={(value: Actions) => handleActionsComments(value, comment?.id)}
                        />
                        <Typography className="commentsDate" variant="subtitle2" color="text.secondary" gutterBottom>
                          {dayjs(comment?.createAt).fromNow()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="contentWrap">
                      <Typography className="content" variant="body2">
                        {comment?.content}
                      </Typography>
                      <Button className="btn-like" variant="outlined" color="primary">
                        <AiOutlineHeart className="btn-like-icon" />
                      </Button>
                    </Box>
                  </Box>
                );
              })
            )}
          </CardContent>
        </Card>
        <DialogCommon
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={!!commentId ? () => handleDeleteComment(commentId) : () => handleDeletePost(postDetail?.id)}
          content={DELETE_POST}
        />
        <NewPost
          isEdit
          open={isEdit}
          onEditSuccess={refetchPostDetail}
          closePostModal={() => setIsEdit(!isEdit)}
          dataEdit={postDetail}
        />
      </Grid>
    </Grid>
  );
});

export default PostDetail;
