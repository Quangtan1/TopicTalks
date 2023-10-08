import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ICommentBody,
  IPost,
  createComment,
  createLike,
  deleteComment,
  deletePost,
  removeLike,
  useGetAllPosts,
  useGetCommentByPostId,
  useGetPostById,
  useGetUserById,
} from 'src/queries';
import accountStore from 'src/store/accountStore';
import { createAxios } from 'src/utils';
import { Box, Grid, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './styles.scss';
import { AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { BsShare } from 'react-icons/bs';
import ActionModal from '../post/actionModal/ActionModal';
import { Actions, actionsMenu } from '../post/actionModal/helpers';
import { useMutation } from 'react-query';
import { useEffect, useRef, useState } from 'react';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import NewPost from '../newPost/NewPost';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { DELETE_POST } from '../post/postHeader';
import Loading from 'src/components/loading/Loading';
import Comments from './comments';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';
import EditCommentModal from './editCommentModal';
import { useShare } from 'react-facebook';

const validationSchema = Yup.object({
  comment: Yup.string().nullable().required('Comment content is required'),
});

const PostDetail = observer(() => {
  const formRef = useRef<FormikProps<any>>(null);
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  dayjs.extend(relativeTime);
  const { id } = useParams<{ id: string }>();
  const setDefaultValue = () => {
    refetchAllPost();
    refetchPostDetail();
    refetchUserById();
    scrollToTop();
    refetchCommentByPostId();
  };

  useEffect(() => {
    setDefaultValue();
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
  const [isShowRightSide, setIsShowRightSide] = useState(true);
  const [isOpenEditCommentModal, setIsOpenEditCommentModal] = useState(false);

  // ========================== Query==========================
  const useDeletePost = useMutation((id: number) => deletePost(id, account));

  const useDeleteComment = useMutation((commentId: number) => deleteComment(commentId, account));

  const useUnlike = useMutation((postId: number) => removeLike(postId, account));

  const useLike = useMutation((postId: number) => createLike(postId, account));

  const { mutateAsync: unLikePost } = useUnlike;

  const { mutateAsync: likePost } = useLike;

  const { refetch: refetchAllPost } = useGetAllPosts(account, setAccount);

  const { data: postDetail, refetch: refetchPostDetail, isLoading } = useGetPostById(+id, axiosJWT, account);

  const { title, content, img_url, author_id, created_at } = (postDetail as IPost) || {};

  const {
    data: userDetailData,
    isLoading: isLoadingUserDetail,
    refetch: refetchUserById,
  } = useGetUserById(author_id, axiosJWT, account);

  const {
    data: allCommentData,
    isLoading: isLoadingComments,
    refetch: refetchCommentByPostId,
  } = useGetCommentByPostId(+id, axiosJWT, account);

  const allComment = allCommentData || [];

  const useCreateComment = useMutation((commentBody: ICommentBody) => createComment(commentBody, account));

  const timeAgo = dayjs(created_at)?.fromNow();

  const handleDeletePost = async (postId: number) => {
    try {
      const result = await useDeletePost.mutateAsync(postId);
      if (result.status === 200) {
        ToastSuccess('Delete post successfully!');
        refetchAllPost();
        setDefaultValue();
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
        setDefaultValue();
        refetchPostDetail();
        refetchCommentByPostId();
      }
    } catch (error) {
      ToastError('Error deleting comment!');
    }
  };
  const isLiked = postDetail?.like?.username?.some((user) => user === account.username);

  const handleClickLike = () => {
    if (isLiked) {
      unLikePost(postDetail?.id);
    }
    likePost(postDetail?.id);
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
        setIsOpenEditCommentModal(true);
        setCommentId(commentId);
        break;
      case Actions.Delete:
        setCommentId(commentId);
        setOpen(!open);
        break;
      default:
        break;
    }
  };

  const handleCreateComment = async (data) => {
    const commentBody = {
      content: data.comment,
      postId: +id,
      userId: +accountStore.account.id,
    };
    try {
      const result = await useCreateComment.mutateAsync(commentBody);
      if (result.status === 201) {
        setDefaultValue();
        console.log('Comment successfully!');
        resetForm();
        refetchCommentByPostId();
      }
      console.log(`Comment result: `, result);
    } catch (error) {
      ToastError(`Error Comment!`);
    }
    if (true) {
    }
  };

  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    validationSchema,
    innerRef: formRef,
    onSubmit: handleCreateComment,
  });

  const { errors, touched, getFieldProps, submitForm, resetForm, values } = formik;

  const formikProps = {
    errors,
    touched,
    getFieldProps,
    submitForm,
    values,
  };

  const toggleCommentBox = () => {
    setIsShowRightSide(!isShowRightSide);
  };

  const { share } = useShare();

  const handleShare = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await share({
        href: 'https://www.facebook.com/sharer',
        display: 'popup',
        hashtag: 'Share post from topicTalks app',
      });
    } catch (error) {
      console.log('🚀 handleShare ~ error:', error);
    }
  };

  return isLoading || isLoadingUserDetail || isLoadingComments ? (
    <>
      <Loading />
    </>
  ) : (
    <Grid container spacing={2} className="post-dt-container">
      {/* Left Side */}
      <Grid item xs={isShowRightSide ? 7 : 12} className="left-side">
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
              <Button
                className={`item2-btn ${isLiked ? 'liked' : ''}`}
                variant="outlined"
                color="primary"
                onClick={handleClickLike}
              >
                <AiOutlineHeart />{' '}
                {postDetail?.like?.totalLike !== 0 && (
                  <Typography className="like-btn-detail">{postDetail?.like?.totalLike}</Typography>
                )}
              </Button>
              <Button className="item2-btn" variant="outlined" color="primary" onClick={toggleCommentBox}>
                <AiOutlineComment />
                {postDetail?.totalComment !== 0 && (
                  <Typography className="like-btn-detail">{postDetail?.totalComment}</Typography>
                )}
              </Button>
              <Button className="item2-btn" variant="outlined" color="primary" onClick={handleShare}>
                <BsShare />
              </Button>
              <Box sx={{ cursor: 'pointer' }}>
                <ActionModal actionsMenu={actionsMenu} onClick={handleActions} />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card className="postImgAndContent">
          <CardMedia component="img" className="img" image={img_url} alt={title} />
          <CardContent className="content">
            <Typography className="post-title" variant="h5" component="div">
              {title}
            </Typography>
            <Typography className="post-content" variant="h6" color="text.secondary">
              {content}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Side */}
      {isShowRightSide && (
        <Grid item xs={5} className="right-side">
          <Comments
            allCommentData={allComment}
            handleActionsComments={handleActionsComments}
            isLoadingComments={isLoadingComments}
            userDetailData={userDetailData}
            formikProps={formikProps}
          />
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
          <EditCommentModal
            content={allComment?.find((comment) => comment?.id === commentId)?.content}
            isOpen={isOpenEditCommentModal}
            onEditSuccess={refetchCommentByPostId}
            commentId={commentId}
            handleClose={() => setIsOpenEditCommentModal(false)}
          />
        </Grid>
      )}
    </Grid>
  );
});

export default PostDetail;
